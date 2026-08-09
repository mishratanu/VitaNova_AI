import { motion } from 'framer-motion';
import { Volume2, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { Language, TriageResult, ConversationMessage } from '../../types';

const DANGER_SIGN_TRANSLATIONS: Record<string, string> = {
  'Fever': 'बुखार',
  'Headache': 'सिरदर्द',
  'Blurred vision': 'धुंधली दृष्टि',
  'Severe headache': 'तीव्र सिरदर्द',
  'Swelling of face': 'चेहरे की सूजन',
  'Swelling of hands': 'हाथों की सूजन',
  'Vaginal bleeding': 'योनि रक्तस्राव',
  // Add more mappings as needed
};

const SEVERITY_CONFIG = {
  green: {
    emoji: '🟢',
    label: 'Safe to manage at home',
    labelHi: 'घर पर देखभाल करें',
    bg: 'bg-severity-green-bg',
    border: 'border-severity-green-border',
    text: 'text-severity-green',
    badge: 'badge-green',
    banner: 'Safe to Stay Home',
    bannerHi: 'घर पर रहें — सुरक्षित',
  },
  yellow: {
    emoji: '🟡',
    label: 'Visit a clinic soon',
    labelHi: 'जल्द क्लिनिक जाएं',
    bg: 'bg-severity-yellow-bg',
    border: 'border-severity-yellow-border',
    text: 'text-severity-yellow',
    badge: 'badge-yellow',
    banner: 'Clinic Visit Recommended',
    bannerHi: 'क्लिनिक जाने की सलाह है',
  },
  red: {
    emoji: '🔴',
    label: 'Emergency — act now',
    labelHi: 'आपातकाल — तुरंत कार्यवाही करें',
    bg: 'bg-severity-red-bg',
    border: 'border-severity-red-border',
    text: 'text-severity-red',
    badge: 'badge-red',
    banner: 'Emergency — Seek Immediate Care',
    bannerHi: 'आपातकाल — तत्काल चिकित्सा',
  },
};

interface Props {
  result: TriageResult;
  language: Language;
  symptoms?: string;
  messages?: ConversationMessage[];
  onProceed: () => void;
}

export default function StepResult({ result, language, symptoms, messages, onProceed }: Props) {
  const cfg = SEVERITY_CONFIG[result.severity];
  const isHi = language === 'hi';

  const speak = () => {
    if (!window.speechSynthesis) return;
    const text = `${cfg.banner}. ${cfg.bannerHi}. ${result.reason}. ${result.reason_hi || ''}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      {/* The "moment" — severity reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
        className={`${cfg.bg} ${cfg.border} border-2 rounded-3xl p-6 text-center shadow-sm relative overflow-hidden`}
      >
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={result.severity === 'red' 
            ? { scale: [1, 1.12, 1], opacity: 1 } 
            : { scale: 1, opacity: 1 }
          }
          transition={result.severity === 'red'
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }
            : { delay: 0.2, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
          }
          className="text-6xl inline-block mb-4"
          role="img"
          aria-label={cfg.label}
        >
          {cfg.emoji}
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className={`text-2xl font-heading font-bold ${cfg.text} mb-1`}>
            {cfg.banner}<br />{cfg.bannerHi}
          </h2>
          <p className={`text-sm font-medium ${cfg.text} opacity-80`}>
            {cfg.label}<br />{cfg.labelHi}
          </p>
        </motion.div>
      </motion.div>

      {/* Reason */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="card"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-heading font-bold text-ink text-base">
            {isHi ? 'कारण' : 'Why this result'}
          </h3>
          <button
            id="tts-listen"
            onClick={speak}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs text-ink-muted hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-50"
            aria-label="Listen to result"
            title="Listen aloud"
          >
            <Volume2 size={14} />
            {isHi ? 'सुनें' : 'Listen'}
          </button>
        </div>
        {/* Bilingual reason */}
        <div className="space-y-3">
          <p className="text-ink-muted leading-relaxed text-sm">{result.reason}</p>
          {result.reason_hi && (
            <>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-widest">हिंदी</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <p className="text-ink-muted leading-relaxed text-sm" lang="hi">{result.reason_hi}</p>
            </>
          )}
        </div>

        {/* Danger signs */}
        {result.dangerSignsDetected?.length > 0 && (
          <div className="mt-4 flex items-start gap-2 bg-severity-red-bg border border-severity-red-border rounded-xl px-4 py-3">
            <AlertTriangle size={16} className="text-severity-red mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-severity-red mb-1">
                {isHi ? 'खतरे के संकेत पाए गए:' : 'Danger signs detected:'}
              </p>
              <p className="text-xs text-severity-red/80">
                {result.dangerSignsDetected.map((sign, idx) => (
                  <span key={idx}>
                    {sign}{idx === result.dangerSignsDetected.length - 1 ? '' : ', '}
                  </span>
                ))}
              </p>
              {/* Hindi translation list */}
              <p className="text-xs text-severity-red/80 mt-1" lang="hi">
                {result.dangerSignsDetected.map((sign, idx) => (
                  <span key={idx}>
                    {DANGER_SIGN_TRANSLATIONS[sign] || sign}{idx === result.dangerSignsDetected.length - 1 ? '' : ', '}
                  </span>
                ))}
              </p>
              {result.forcedBySafetyRule && (
                <p className="text-xs font-bold text-severity-red mt-2 flex items-center gap-1 bg-red-100 w-fit px-2 py-0.5 rounded">
                  <ShieldCheck size={12} />
                  {isHi ? 'सुरक्षा कोड द्वारा गंभीरता निर्धारित' : 'Severity forced by safety code'}
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Advice */}
      {result.advice?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="card"
        >
          <h3 className="font-heading font-bold text-ink text-base mb-3">
            {isHi ? 'अभी क्या करें' : 'What to do now'}
          </h3>
          <div className="space-y-3">
            <ul className="space-y-2.5">
              {result.advice.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ink-muted">
                  <span className="w-5 h-5 rounded-full bg-primary-50 text-primary border border-primary-100 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            {result.advice_hi && (
              <>
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-widest">हिंदी</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <ul className="space-y-2.5">
                  {result.advice_hi.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-ink-muted" lang="hi">
                      <span className="w-5 h-5 rounded-full bg-primary-50 text-primary border border-primary-100 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Medical disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
        role="note"
        aria-label="Medical disclaimer"
      >
        <ShieldCheck size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed">
          {isHi
            ? 'VitaNova AI एक ट्रायज सहायक है, निदान उपकरण नहीं। किसी भी चिकित्सा निर्णय के लिए योग्य डॉक्टर से परामर्श करें।'
            : 'VitaNova AI is a triage assistant, not a diagnostic tool. Always consult a qualified healthcare professional for medical decisions. In emergencies, call 108.'
          }
        </p>
      </motion.div>

      {/* Summary */}
      {(symptoms || (messages && messages.length > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="card"
        >
          <h3 className="font-heading font-bold text-ink text-sm mb-2">
            {isHi ? 'आपका सारांश' : 'Your Summary'}
          </h3>
          <div className="text-xs text-ink-muted space-y-2">
            {symptoms && <p><span className="font-semibold text-ink">{isHi ? 'लक्षण:' : 'Symptoms:'}</span> {symptoms}</p>}
            {messages?.map((m, i) => (
              <p key={i}>
                <span className="font-semibold text-ink">{m.role === 'assistant' ? 'AI:' : isHi ? 'आप:' : 'You:'}</span> {m.content}
              </p>
            ))}
            <p><span className="font-semibold text-ink">{isHi ? 'परिणाम:' : 'Verdict:'}</span> <span className={cfg.text}>{isHi ? cfg.labelHi : cfg.label}</span></p>
          </div>
        </motion.div>
      )}

      {/* CTA */}
      <motion.button
        id="proceed-to-action"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={onProceed}
        className={`w-full py-4 text-base font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95
          ${result.severity === 'red' ? 'btn-danger' : 'btn-primary'}`}
      >
        {isHi ? 'अगला कदम देखें' : 'See recommended actions'}
        <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  );
}
