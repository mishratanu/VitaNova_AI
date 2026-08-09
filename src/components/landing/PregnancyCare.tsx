import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ShieldCheck, AlertOctagon, Code } from 'lucide-react';

const DANGER_SIGNS = [
  'Vaginal bleeding', 'Blurred vision', 'Severe headache',
  'Reduced fetal movement', 'Swelling of face/hands', 'Convulsions',
];

export default function PregnancyCare() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="pregnancy" className="section bg-white">
      <div className="container-max">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="rounded-3xl overflow-hidden border border-pink-200 bg-gradient-to-br from-pink-50 via-white to-pink-50 p-8 md:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div className="space-y-6">
              <span className="inline-block text-sm font-semibold text-pink-600 bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full">
                ✨ Differentiator Feature
              </span>

              <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink leading-tight">
                Pregnancy care is a{' '}
                <span className="text-pink-600">non-negotiable safety layer</span>
              </h2>

              <p className="text-ink-muted text-lg leading-relaxed">
                When a pregnant user enables Pregnancy Mode, VitaNova AI applies the strictest
                triage rules — including a hard-coded code override.
              </p>

              <div className="flex items-start gap-3 bg-white rounded-2xl border border-pink-100 shadow-card p-4">
                <Code size={18} className="text-pink-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-ink text-sm mb-1">Deterministic code rule — not a prompt</p>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    If <code className="bg-gray-100 px-1 rounded text-pink-700">pregnancyFlag = true</code> and any danger sign is present in the symptom text, the backend <strong>always forces severity → Red</strong>, regardless of what the AI returned. This cannot be overridden by the AI.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white rounded-2xl border border-red-100 shadow-card p-4">
                <AlertOctagon size={18} className="text-severity-red mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-ink text-sm mb-1">Monitored danger signs</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DANGER_SIGNS.map((sign) => (
                      <span key={sign} className="text-xs bg-red-50 text-severity-red border border-red-100 px-2.5 py-1 rounded-full">
                        {sign}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right — visual */}
            <div className="space-y-4">
              {/* Toggle card */}
              <div className="bg-white rounded-2xl shadow-card p-5 border border-pink-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤰</span>
                    <div>
                      <p className="font-semibold text-ink text-sm">Pregnancy Care Mode</p>
                      <p className="text-xs text-ink-muted">गर्भावस्था देखभाल मोड</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-pink-500 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow" />
                  </div>
                </div>
                <div className="mt-4 bg-pink-50 border border-pink-100 rounded-xl px-4 py-3">
                  <p className="text-xs text-pink-700 font-medium">
                    🛡️ Extra safety active — AI escalation rules applied, danger sign scanning enabled
                  </p>
                </div>
              </div>

              {/* Forced red result */}
              <div className="bg-severity-red-bg border-2 border-severity-red-border rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🔴</span>
                  <div>
                    <p className="font-bold text-severity-red text-base">Emergency — Immediate Care</p>
                    <p className="text-xs text-ink-muted">Severity forced by safety code</p>
                  </div>
                </div>
                <p className="text-sm text-ink leading-relaxed">
                  ⚠️ Pregnancy danger sign detected: <strong>vaginal bleeding</strong>. This overrides the AI assessment. Please call 108 immediately.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <ShieldCheck size={16} className="text-primary" />
                <p>This rule is in the server code, not a prompt — it cannot be hallucinated away.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
