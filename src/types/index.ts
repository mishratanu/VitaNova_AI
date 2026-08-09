export type Language = 'en' | 'hi';
export type Severity = 'green' | 'yellow' | 'red';
export type AppStep = 'describe' | 'qa' | 'result' | 'action';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TriageRequest {
  symptoms: string;
  language: Language;
  pregnancyFlag: boolean;
  messages: ConversationMessage[];
  questionCount: number;
}

export interface TriageQuestion {
  type: 'question';
  question: string;     // fallback (same as question_en)
  question_en: string;
  question_hi: string;
}

export interface TriageResult {
  type: 'result';
  severity: Severity;
  reason: string;       // English reason
  reason_hi: string;   // Hindi reason
  advice: string[];
  advice_hi?: string[];
  dangerSignsDetected: string[];
  forcedBySafetyRule?: boolean;
}

export type TriageResponse = TriageQuestion | TriageResult;

export interface PHCContact {
  name: string;
  phone: string;
  distance: string;
  address: string;
}
