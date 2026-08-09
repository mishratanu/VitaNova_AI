import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageSquare, HelpCircle, Activity, Zap } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: MessageSquare,
    title: 'Describe your symptoms',
    titleHi: 'अपने लक्षण बताएं',
    desc: 'Type or select symptoms in Hindi or English. Tap the pregnancy toggle for extra safety monitoring.',
    color: 'bg-primary-50 text-primary border-primary-100',
  },
  {
    num: '02',
    icon: HelpCircle,
    title: 'AI asks smart questions',
    titleHi: 'AI स्मार्ट सवाल पूछती है',
    desc: 'Claude AI asks 2–3 targeted clarifying questions — like a doctor would — to understand your situation.',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    num: '03',
    icon: Activity,
    title: 'Get a severity result',
    titleHi: 'गंभीरता का परिणाम पाएं',
    desc: 'Receive a clear Green / Yellow / Red verdict with a plain-language reason you can understand.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    num: '04',
    icon: Zap,
    title: 'Take the right action',
    titleHi: 'सही कदम उठाएं',
    desc: 'Home care tips, nearest PHC contact, or emergency SOS — the right next step, every time.',
    color: 'bg-accent/10 text-accent border-orange-100',
  },
];

export default function Solution() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="solution" className="section bg-[#FAF9F6]">
      <div className="container-max">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-block text-sm font-semibold text-primary bg-primary-50 px-4 py-1.5 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-4">
            Four steps to clarity
          </h2>
          <p className="text-ink-muted text-lg">
            No medical jargon, no registration, no waiting rooms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary-100 via-primary-200 to-primary-100 pointer-events-none" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="card-hover relative flex flex-col gap-4"
              >
                {/* Step number + icon */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${step.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-3xl font-heading font-bold text-gray-100">{step.num}</span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-ink text-lg leading-snug">{step.title}</h3>
                  <p className="text-xs text-ink-muted font-medium mt-0.5 mb-3">{step.titleHi}</p>
                  <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
