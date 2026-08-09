import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Globe, Heart, Wifi, Lock, BookOpen, Siren } from 'lucide-react';

const FEATURES = [
  {
    icon: Globe,
    title: 'Bilingual (Hindi/English)',
    desc: 'Support for Hindi and English, ensuring the interface is understandable for local users.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Heart,
    title: 'Guided AI Q&A',
    desc: 'AI-generated clarifying questions asked one at a time to deeply understand the user\'s symptoms.',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: BookOpen,
    title: 'Actionable Severity Results',
    desc: 'Returns a Green/Yellow/Red severity tier with a plain-language reason and distinct action branches (home tips / PHC contact / SOS).',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Lock,
    title: 'Server-side API Security',
    desc: 'Node.js serverless backend route calls the Claude API. The API key stays server-side only and is never exposed to the browser.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Siren,
    title: 'Text-to-Speech (TTS)',
    desc: 'A dedicated "Listen" button on the result screen to read the AI severity result and reasoning aloud.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Wifi,
    title: 'Fully Accessible',
    desc: 'Fully responsive (360px–desktop), WCAG AA contrast, keyboard/screen-reader accessible, with designed loading/error states.',
    color: 'bg-red-50 text-red-600',
  },
];

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" className="section bg-white">
      <div className="container-max">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-block text-sm font-semibold text-primary bg-primary-50 px-4 py-1.5 rounded-full mb-4">
            Core Features
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-4">
            Built for the realities of rural healthcare
          </h2>
          <p className="text-ink-muted text-lg">
            Every feature decision was made with a village health worker or pregnant mother in mind.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="card-hover group"
              >
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-ink text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
