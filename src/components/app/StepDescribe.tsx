import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, BabyIcon, Mic } from 'lucide-react';
import LanguageToggle from '../ui/LanguageToggle';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import type { Language } from '../../types';

const SYMPTOM_CHIPS = [
  'Fever', 'Headache', 'Cough', 'Body ache', 'Nausea', 'Vomiting',
  'Diarrhea', 'Weakness', 'Chest pain', 'Breathlessness', 'Rash', 'Dizziness',
];
const SYMPTOM_CHIPS_HI = [
  'बुखार', 'सिरदर्द', 'खांसी', 'बदन दर्द', 'मतली', 'उल्टी',
  'दस्त', 'कमजोरी', 'सीने में दर्द', 'सांस फूलना', 'दाने', 'चक्कर',
];

interface Props {
  language: Language;
  pregnancyFlag: boolean;
  loading: boolean;
  error: string | null;
  onLanguageChange: (lang: Language) => void;
  onPregnancyChange: (flag: boolean) => void;
  onSubmit: (symptoms: string) => void;
}

export default function StepDescribe({
  language, pregnancyFlag, loading, error, onLanguageChange, onPregnancyChange, onSubmit,
}: Props) {
  const [text, setText] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  // Speech Recognition
  const handleSpeechResult = (transcript: string) => {
    setText((prev) => (prev ? prev + ' ' + transcript : transcript));
  };
  const { isListening, isSupported, toggleListening } = useSpeechRecognition({
    language,
    onResult: handleSpeechResult,
  });

  const chips = language === 'hi' ? SYMPTOM_CHIPS_HI : SYMPTOM_CHIPS;
  const isHi = language === 'hi';

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleSubmit = () => {
    const combined = [text.trim(), ...selectedChips].filter(Boolean).join(', ');
    if (!combined) return;
    onSubmit(combined);
  };

  const canSubmit = text.trim().length > 2 || selectedChips.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      {/* Language toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-bold text-ink">
            {isHi ? 'अपने लक्षण बताएं' : 'Describe your symptoms'}
          </h2>
          <p className="text-sm text-ink-muted mt-0.5">
            {isHi ? 'जितना हो सके विस्तार से लिखें' : 'Be as detailed as possible'}
          </p>
        </div>
        <LanguageToggle language={language} onChange={onLanguageChange} />
      </div>

      {/* Textarea */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="symptoms-input" className="block text-sm font-medium text-ink">
            {isHi ? 'लक्षण विवरण' : 'Symptom description'}
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
          id="symptoms-input"
          className="textarea-field"
          rows={4}
          placeholder={isHi
            ? 'जैसे: मुझे 2 दिनों से तेज़ बुखार है, सिर में दर्द और थकान भी है...'
            : 'e.g. I have had a high fever for 2 days with a severe headache and fatigue...'
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          aria-label={isHi ? 'लक्षण विवरण' : 'Symptom description'}
        />
      </div>

      {/* Symptom chips */}
      <div>
        <p className="text-sm font-medium text-ink mb-3">
          {isHi ? 'या नीचे से चुनें:' : 'Or tap to select common symptoms:'}
        </p>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              id={`chip-${chip}`}
              onClick={() => toggleChip(chip)}
              aria-pressed={selectedChips.includes(chip)}
              disabled={loading}
              className={`chip ${selectedChips.includes(chip) ? 'chip-selected' : ''}`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Pregnancy toggle */}
      <div className={`flex items-center justify-between rounded-2xl border px-5 py-4 transition-colors cursor-pointer ${
        pregnancyFlag ? 'bg-pink-50 border-pink-200' : 'bg-white border-gray-200'
      }`}
        onClick={() => onPregnancyChange(!pregnancyFlag)}
        role="switch"
        aria-checked={pregnancyFlag}
        aria-label="Pregnancy care mode"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onPregnancyChange(!pregnancyFlag)}
      >
        <div className="flex items-center gap-3">
          <BabyIcon size={20} className={pregnancyFlag ? 'text-pink-600' : 'text-ink-muted'} />
          <div>
            <p className={`font-semibold text-sm ${pregnancyFlag ? 'text-pink-700' : 'text-ink'}`}>
              {isHi ? 'गर्भावस्था देखभाल मोड' : 'Pregnancy care mode'}
            </p>
            <p className="text-xs text-ink-muted">
              {isHi ? 'अतिरिक्त सुरक्षा नियम लागू होंगे' : 'Extra safety rules will apply'}
            </p>
          </div>
        </div>
        <div
          className={`w-12 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0 ${
            pregnancyFlag ? 'bg-pink-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform duration-200 ${
              pregnancyFlag ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-severity-red-bg border border-severity-red-border rounded-xl px-4 py-3 text-sm text-severity-red" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* Submit */}
      <button
        id="submit-symptoms"
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        className="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isHi ? 'AI से परामर्श करें' : 'Get AI triage'}
      >
        {loading ? (
          <>
            <LoadingSpinner size={20} />
            {isHi ? 'विश्लेषण हो रहा है...' : 'Analyzing symptoms...'}
          </>
        ) : (
          <>
            {isHi ? 'AI से परामर्श करें' : 'Get AI Triage'}
            <Send size={18} />
          </>
        )}
      </button>
    </motion.div>
  );
}
