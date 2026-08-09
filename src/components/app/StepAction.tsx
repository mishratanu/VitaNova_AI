import { motion } from 'framer-motion';
import { Phone, MapPin, RefreshCw, Siren, Home, CheckCircle2 } from 'lucide-react';
import type { Language, TriageResult } from '../../types';

interface Props {
  result: TriageResult;
  language: Language;
  onReset: () => void;
}

// ─── Green Action ───────────────────────────────────────────────────────────
function GreenAction({ result, isHi }: { result: TriageResult; isHi: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-3 bg-severity-green-bg border border-severity-green-border rounded-2xl px-5 py-4">
        <span className="text-3xl">🟢</span>
        <div>
          <h3 className="font-heading font-bold text-severity-green text-lg">
            {isHi ? 'घर पर देखभाल करें' : 'Home Care Recommended'}
          </h3>
          <p className="text-sm text-severity-green/80">
            {isHi ? 'आराम करें और नीचे दिए सुझाव अपनाएं' : 'Rest and follow these tips'}
          </p>
        </div>
      </div>

      <div className="card space-y-3">
        <h4 className="font-heading font-semibold text-ink flex items-center gap-2">
          <Home size={16} className="text-severity-green" />
          {isHi ? 'घरेलू देखभाल सुझाव' : 'Home care tips'}
        </h4>
        {(result.advice || []).map((tip, i) => (
          <div key={i} className="flex items-start gap-3 text-sm text-ink-muted py-2 border-b border-gray-100 last:border-0">
            <CheckCircle2 size={16} className="text-severity-green mt-0.5 flex-shrink-0" />
            {tip}
          </div>
        ))}
        <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 mt-2">
          <p className="text-xs text-primary font-medium">
            {isHi
              ? '⚠️ यदि 48 घंटे में सुधार न हो या लक्षण बिगड़ें तो PHC जाएं'
              : '⚠️ If no improvement in 48 hrs or symptoms worsen, visit your nearest PHC'
            }
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Yellow Action ───────────────────────────────────────────────────────────
function YellowAction({ result, isHi }: { result: TriageResult; isHi: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-3 bg-severity-yellow-bg border border-severity-yellow-border rounded-2xl px-5 py-4">
        <span className="text-3xl">🟡</span>
        <div>
          <h3 className="font-heading font-bold text-severity-yellow text-lg">
            {isHi ? 'प्राथमिक स्वास्थ्य केंद्र जाएं' : 'Visit Your PHC'}
          </h3>
          <p className="text-sm text-severity-yellow/80">
            {isHi ? '1-2 दिन के अंदर डॉक्टर से मिलें' : 'See a doctor within 1–2 days'}
          </p>
        </div>
      </div>

      {/* PHC contact card */}
      <div className="card border border-severity-yellow-border shadow-none space-y-4">
        <h4 className="font-heading font-semibold text-ink text-base flex items-center gap-2">
          <MapPin size={16} className="text-severity-yellow" />
          {isHi ? 'निकटतम प्राथमिक स्वास्थ्य केंद्र' : 'Nearest Primary Health Centre'}
        </h4>

        <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1">
          <p className="font-semibold text-ink text-sm">Sector-12 PHC, Raipur</p>
          <p className="text-xs text-ink-muted">📍 2.4 km — Sector 12 Main Road, Near Bus Stand</p>
          <p className="text-xs text-ink-muted">🕒 Mon–Sat, 8 AM – 4 PM</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            id="call-phc"
            href="tel:+911234567890"
            className="flex items-center justify-center gap-2 bg-severity-yellow-bg border border-severity-yellow-border text-severity-yellow font-semibold text-sm px-4 py-3 rounded-xl hover:bg-yellow-100 transition-colors min-h-[44px]"
          >
            <Phone size={16} />
            {isHi ? 'कॉल करें' : 'Call PHC'}
          </a>
          <button
            id="directions-phc"
            onClick={(e) => {
              e.preventDefault();
              const fallbackUrl = 'https://www.google.com/maps/search/primary+health+centre+near+me';
              if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    window.open(`https://www.google.com/maps/search/primary+health+centre/@${pos.coords.latitude},${pos.coords.longitude},14z`, '_blank');
                  },
                  () => window.open(fallbackUrl, '_blank'),
                  { timeout: 5000 }
                );
              } else {
                window.open(fallbackUrl, '_blank');
              }
            }}
            className="flex items-center justify-center gap-2 bg-primary-50 border border-primary-100 text-primary font-semibold text-sm px-4 py-3 rounded-xl hover:bg-primary-100 transition-colors min-h-[44px]"
          >
            <MapPin size={16} />
            {isHi ? 'दिशा पाएं' : 'Get Directions'}
          </button>
        </div>
      </div>

      {result.advice?.length > 0 && (
        <div className="card space-y-2">
          <h4 className="font-semibold text-ink text-sm">
            {isHi ? 'जाने से पहले घर पर:' : 'While you prepare to go:'}
          </h4>
          {result.advice.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-ink-muted">
              <span className="text-severity-yellow">▪</span> {tip}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Red Action ─────────────────────────────────────────────────────────────
function RedAction({ isHi }: { result: TriageResult; isHi: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* SOS banner */}
      <motion.div
        animate={{ boxShadow: ['0 0 0px rgba(220,38,38,0)', '0 0 24px rgba(220,38,38,0.3)', '0 0 0px rgba(220,38,38,0)'] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="bg-severity-red-bg border-2 border-severity-red-border rounded-2xl px-5 py-5 text-center"
      >
        <span className="text-4xl block mb-2">🚨</span>
        <h3 className="font-heading font-bold text-severity-red text-xl mb-1">
          {isHi ? 'आपातकाल — अभी मदद लें' : 'Emergency — Get Help Now'}
        </h3>
        <p className="text-severity-red/80 text-sm">
          {isHi ? 'देरी न करें — तत्काल चिकित्सा आवश्यक है' : 'Do not delay — immediate medical attention required'}
        </p>
      </motion.div>

      {/* Emergency call */}
      <a
        id="sos-call-108"
        href="tel:108"
        className="flex items-center justify-center gap-3 bg-severity-red text-white font-bold text-lg w-full py-5 rounded-2xl shadow-red-glow hover:bg-red-700 transition-colors active:scale-95"
        aria-label="Call 108 emergency ambulance"
      >
        <Siren size={24} />
        {isHi ? '108 — एम्बुलेंस बुलाएं' : 'Call 108 — Ambulance'}
      </a>

      {/* What not to do */}
      <div className="card border border-severity-red-border bg-severity-red-bg shadow-none">
        <h4 className="font-semibold text-severity-red text-sm mb-3">
          {isHi ? '❌ अभी ये न करें:' : '❌ Do NOT do these things now:'}
        </h4>
        {[
          isHi ? 'खुद ड्राइव करके अस्पताल न जाएं' : 'Do not drive yourself to hospital',
          isHi ? 'बिना डॉक्टर की सलाह दवा न लें' : 'Do not take medicines without medical advice',
          isHi ? 'लक्षण कम होने का इंतजार न करें' : 'Do not wait for symptoms to improve on their own',
        ].map((item) => (
          <p key={item} className="text-xs text-severity-red/80 py-1.5 border-b border-red-200 last:border-0">
            {item}
          </p>
        ))}
      </div>

      {/* Alert family */}
      <div className="card space-y-2">
        <h4 className="font-semibold text-ink text-sm">
          {isHi ? '📱 परिवार को सूचित करें' : '📱 Alert someone nearby'}
        </h4>
        <p className="text-xs text-ink-muted">
          {isHi
            ? 'किसी परिवार के सदस्य या ASHA कार्यकर्ता को तुरंत सूचित करें।'
            : 'Inform a family member or your ASHA community health worker immediately.'
          }
        </p>
        <a
          id="share-location"
          href={`sms:?body=${encodeURIComponent('I need immediate medical help. Please assist me — VitaNova AI has detected an emergency.')}`}
          className="btn-secondary text-sm w-full mt-2"
        >
          {isHi ? 'SMS से मदद मांगें' : 'Send SOS via SMS'}
        </a>
      </div>
    </motion.div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function StepAction({ result, language, onReset }: Props) {
  const isHi = language === 'hi';

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-heading font-bold text-ink">
          {isHi ? 'अनुशंसित कार्य' : 'Recommended Actions'}
        </h2>
        <p className="text-sm text-ink-muted mt-0.5">
          {isHi ? 'अपनी स्थिति के अनुसार नीचे कदम उठाएं' : 'Take the steps below based on your severity'}
        </p>
      </div>

      {result.severity === 'green' && <GreenAction result={result} isHi={isHi} />}
      {result.severity === 'yellow' && <YellowAction result={result} isHi={isHi} />}
      {result.severity === 'red' && <RedAction result={result} isHi={isHi} />}

      {/* Medical disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3" role="note">
        <p className="text-xs text-amber-800 leading-relaxed">
          ⚠️ {isHi
            ? 'VitaNova AI एक ट्रायज सहायक है, निदान नहीं। हमेशा योग्य डॉक्टर से परामर्श करें।'
            : 'VitaNova AI is a triage assistant, not a diagnosis. Always consult a qualified healthcare professional.'
          }
        </p>
      </div>

      {/* Start over */}
      <button
        id="start-over"
        onClick={onReset}
        className="btn-ghost w-full flex items-center justify-center gap-2 text-sm"
      >
        <RefreshCw size={16} />
        {isHi ? 'नई जांच शुरू करें' : 'Start a new triage'}
      </button>
    </motion.div>
  );
}
