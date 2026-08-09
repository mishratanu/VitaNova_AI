import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';

const STATS = [
  {
    icon: AlertTriangle,
    value: '65%',
    label: 'of rural Indians lack access to a doctor within 5 km',
    sub: 'Rural Health Statistics, India',
    color: 'text-accent',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
  {
    icon: MapPin,
    value: '1 in 3',
    label: 'maternal deaths in rural India are linked to delayed recognition of danger signs',
    sub: 'WHO / National Health Mission estimates',
    color: 'text-severity-red',
    bg: 'bg-red-50',
    border: 'border-red-100',
  },
  {
    icon: Clock,
    value: '< 30 sec',
    label: 'to describe symptoms and get a clear, actionable severity result',
    sub: 'VitaNova AI average response time',
    color: 'text-severity-yellow',
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
  },
];

function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`card-hover border ${stat.border} flex flex-col gap-4`}
    >
      <div className={`w-12 h-12 ${stat.bg} ${stat.border} border rounded-xl flex items-center justify-center`}>
        <Icon size={22} className={stat.color} />
      </div>
      <div>
        <p className={`text-4xl font-heading font-bold ${stat.color} leading-none mb-2`}>{stat.value}</p>
        <p className="text-ink font-medium leading-snug">{stat.label}</p>
        <p className="text-xs text-ink-light mt-2">{stat.sub}</p>
      </div>
    </motion.div>
  );
}

// The Problem Section Component
export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="problem" className="section bg-white">
      <div className="container-max">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-block text-sm font-semibold text-primary bg-primary-50 px-4 py-1.5 rounded-full mb-4">
            The Problem
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-4">
            Rural India's healthcare crisis is invisible to most
          </h2>
          <p className="text-ink-muted text-lg leading-relaxed">
            Millions in rural India live far from the nearest doctor. A simple fever or a pregnancy warning sign can turn into an emergency simply because no one knew what to do or when to act. VitaNova AI closes that gap with instant, AI-guided triage in the language people speak at home.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
