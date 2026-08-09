import { useState, useCallback } from 'react';
import type {
  Language, AppStep, ConversationMessage, TriageResult, TriageRequest,
} from '../types';

interface TriageState {
  step: AppStep;
  language: Language;
  pregnancyFlag: boolean;
  symptoms: string;
  messages: ConversationMessage[];
  currentQuestion: string;    // English (legacy/fallback)
  currentQuestionEn: string;
  currentQuestionHi: string;
  result: TriageResult | null;
  loading: boolean;
  error: string | null;
  questionCount: number;
}

const initialState: TriageState = {
  step: 'describe',
  language: 'en',
  pregnancyFlag: false,
  symptoms: '',
  messages: [],
  currentQuestion: '',
  currentQuestionEn: '',
  currentQuestionHi: '',
  result: null,
  loading: false,
  error: null,
  questionCount: 0,
};

export function useTriage() {
  const [state, setState] = useState<TriageState>(initialState);

  const setLanguage = useCallback((lang: Language) => {
    setState((s) => ({ ...s, language: lang }));
  }, []);

  const setPregnancyFlag = useCallback((flag: boolean) => {
    setState((s) => ({ ...s, pregnancyFlag: flag }));
  }, []);

  const setSymptoms = useCallback((symptoms: string) => {
    setState((s) => ({ ...s, symptoms }));
  }, []);

  /** Called when user submits initial symptoms */
  const submitSymptoms = useCallback(async (symptoms: string) => {
    setState((s) => ({ ...s, loading: true, error: null, symptoms }));
    try {
      const req: TriageRequest = {
        symptoms,
        language: state.language,
        pregnancyFlag: state.pregnancyFlag,
        messages: [],
        questionCount: 0,
      };
      const data = await callAPI(req);

      if (data.type === 'question') {
        setState((s) => ({
          ...s,
          loading: false,
          step: 'qa',
          currentQuestion: data.question_en || data.question,
          currentQuestionEn: data.question_en || data.question,
          currentQuestionHi: data.question_hi || data.question,
          messages: [{ role: 'assistant', content: data.question_en || data.question }],
          questionCount: 1,
        }));
      } else {
        // AI gave result immediately (very clear symptoms)
        setState((s) => ({
          ...s,
          loading: false,
          step: 'result',
          result: data,
        }));
      }
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: getErrMsg(err) }));
    }
  }, [state.language, state.pregnancyFlag]);

  /** Called when user answers a clarifying question */
  const submitAnswer = useCallback(async (answer: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));

    const newMessages: ConversationMessage[] = [
      ...state.messages,
      { role: 'user', content: answer },
    ];

    try {
      const req: TriageRequest = {
        symptoms: state.symptoms,
        language: state.language,
        pregnancyFlag: state.pregnancyFlag,
        messages: newMessages,
        questionCount: state.questionCount,
      };
      const data = await callAPI(req);

      if (data.type === 'question' && state.questionCount < 3) {
        setState((s) => ({
          ...s,
          loading: false,
          currentQuestion: data.question_en || data.question,
          currentQuestionEn: data.question_en || data.question,
          currentQuestionHi: data.question_hi || data.question,
          messages: [...newMessages, { role: 'assistant', content: data.question_en || data.question }],
          questionCount: s.questionCount + 1,
        }));
      } else {
        // Move to result
        const result = data.type === 'result' ? data : {
          type: 'result' as const,
          severity: 'yellow' as const,
          reason: 'Based on your answers, a professional evaluation is recommended.',
          advice: ['Visit your nearest health center', 'Seek medical advice today'],
          dangerSignsDetected: [],
        };
        setState((s) => ({
          ...s,
          loading: false,
          step: 'result',
          result,
          messages: [...newMessages],
        }));
      }
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: getErrMsg(err) }));
    }
  }, [state]);

  /** Move from result to action */
  const proceedToAction = useCallback(() => {
    setState((s) => ({ ...s, step: 'action' }));
  }, []);

  /** Reset to start */
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setLanguage,
    setPregnancyFlag,
    setSymptoms,
    submitSymptoms,
    submitAnswer,
    proceedToAction,
    reset,
  };
}

async function callAPI(body: TriageRequest) {
  const res = await fetch('/api/triage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `API error ${res.status}`);
  }
  return res.json();
}

function getErrMsg(err: unknown): string {
  if (!(err instanceof Error)) return 'Something went wrong. Please try again.';
  const msg = err.message;
  if (msg.includes('Missing API key')) {
    return msg;
  }
  if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many Requests')) {
    return 'Gemini API quota limit reached (429). Please wait a moment or try again later.';
  }
  return msg || 'Something went wrong. Please try again.';
}
