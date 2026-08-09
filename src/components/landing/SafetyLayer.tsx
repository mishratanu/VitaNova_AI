import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const TIERS = [
  {
    emoji: '🟢',
    label: 'Green — Stay Home',
    severity: 'green',
    bg: 'bg-severity-green-bg',
    border: 'border-severity-green-border',
    textColor: 'text-severity-green',
    heading: 'Minor symptoms, safe to monitor',
    actions: [
      'Step-by-step home care tips (fluids, rest, temperature management)',
      'What warning signs to watch for that require escalation',
      'When to revisit the triage if things don\'t improve',
    ],
  },
  {
    emoji: '🟡',
    label: 'Yellow — Visit PHC',
    severity: 'yellow',
    bg: 'bg-severity-yellow-bg',
    border: 'border-severity-yellow-border',
    textColor: 'text-severity-yellow',
    heading: 'Moderate — needs a doctor soon',
    actions: [
      'Nearest Primary Health Centre contact card with phone number',
      'One-tap call button and directions link',
      'Interim home care while you travel',
    ],
  },
  {
    emoji: '🔴',
    label: 'Red — Emergency',
    severity: 'red',
    bg: 'bg-severity-red-bg',
    border: 'border-severity-red-border',
    textColor: 'text-severity-red',
    heading: 'Urgent — act immediately',
    actions: [
      'Prominent SOS alert to call 108 emergency ambulance',
      'What NOT to do while waiting for help',
      'Alert a family member or community health worker',
    ],
  },
];

export default function SafetyLayer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="safety" className="section bg-[#FAF9F6]">
      <div className="container-max">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-block text-sm font-semibold text-primary bg-primary-50 px-4 py-1.5 rounded-full mb-4">
            Safety & Action Layer
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-4">
            Every result connects to a clear, safe next action
          </h2>
          <p className="text-ink-muted text-lg">
            Color and icon together — never color alone. WCAG AA accessible for everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.severity}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`rounded-2xl border-2 ${tier.bg} ${tier.border} p-6 flex flex-col gap-4`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{tier.emoji}</span>
                <span className={`font-heading font-bold text-base ${tier.textColor}`}>{tier.label}</span>
              </div>
              <p className="font-semibold text-ink text-sm">{tier.heading}</p>
              <ul className="space-y-2.5">
                {tier.actions.map((action) => (
                  <li key={action} className="flex gap-2 text-sm text-ink-muted">
                    <span className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${tier.bg} ${tier.textColor} border ${tier.border}`}>
                      ✓
                    </span>
                    {action}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
