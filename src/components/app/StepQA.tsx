import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Mic } from 'lucide-react';
import LoadingSpinner, { LoadingDots } from '../ui/LoadingSpinner';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import type { Language } from '../../types';

interface Props {
  question: string;       // legacy fallback
  question_en: string;
  question_hi: string;
  questionCount: number;
  language: Language;
  loading: boolean;
  error: string | null;
  onAnswer: (answer: string) => void;
}

export default function StepQA({ question, question_en, question_hi, questionCount, language, loading, error, onAnswer }: Props) {
  const [answer, setAnswer] = useState('');
  const isHi = language === 'hi';

  // Use bilingual versions if available, fall back to legacy single-field
  const displayEn = question_en || question;
  const displayHi = question_hi || question;

  // Speech Recognition
  const handleSpeechResult = (transcript: string) => {
    setAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
  };
  const { isListening, isSupported, toggleListening } = useSpeechRecognition({
    language,
    onResult: handleSpeechResult,
  });

  const handleSubmit = () => {
    if (!answer.trim()) return;
    onAnswer(answer.trim());
    setAnswer('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            {isHi ? `प्रश्न ${questionCount}/3` : `Question ${questionCount} of 3`}
          </span>
        </div>
        <h2 className="text-xl font-heading font-bold text-ink">
          {isHi ? 'AI के प्रश्न का उत्तर दें' : 'Answer the AI\'s question'}
        </h2>
        <p className="text-sm text-ink-muted mt-0.5">
          {isHi ? 'सटीक उत्तर से बेहतर परिणाम मिलेगा' : 'More detail leads to a better assessment'}
        </p>
      </div>

      {/* AI Question bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="flex gap-3 items-start"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
            <Bot size={18} className="text-white" />
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-card flex-1">
            {loading && !question ? (
              <LoadingDots className="text-primary" />
            ) : (
              <div className="space-y-3">
                {/* English question */}
                <p className="text-ink leading-relaxed text-base">{displayEn}</p>

                {/* Divider + Hindi question */}
                {displayHi && displayHi !== displayEn && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-widest">हिंदी</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <p className="text-ink-muted leading-relaxed text-sm" lang="hi">{displayHi}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Answer input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="qa-answer" className="block text-sm font-medium text-ink">
            {isHi ? 'आपका उत्तर' : 'Your answer'}
          </label>
          
          {isSupported && (
            <button
              type="button"
              onClick={toggleListening}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600 animate-pulse' 
                  : 'bg-primary-50 text-primary hover:bg-primary-100'
              }`}
            >
              <Mic size={14} className={isListening ? 'animate-bounce' : ''} />
              {isListening 
                ? (isHi ? 'सुन रहा है...' : 'Listening...') 
                : (isHi ? 'बोलकर बताएं' : 'Speak')
              }
            </button>
          )}
        </div>
        <textarea
          id="qa-answer"
          className="textarea-field"
          rows={3}
          placeholder={isHi
            ? 'यहाँ अपना उत्तर लिखें...'
            : 'Type your answer here...'
          }
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
          aria-label={isHi ? 'आपका उत्तर' : 'Your answer'}
        />
        <p className="text-xs text-ink-muted">
          {isHi ? 'Enter दबाएं या नीचे बटन क्लिक करें' : 'Press Enter or click the button below to submit'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-severity-red-bg border border-severity-red-border rounded-xl px-4 py-3 text-sm text-severity-red" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* Submit */}
      <button
        id="submit-answer"
        onClick={handleSubmit}
        disabled={!answer.trim() || loading}
        className="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <LoadingSpinner size={20} />
            {isHi ? 'AI सोच रही है...' : 'AI is thinking...'}
          </>
        ) : (
          <>
            {isHi ? 'उत्तर भेजें' : 'Send Answer'}
            <Send size={18} />
          </>
        )}
      </button>
    </motion.div>
  );
}
