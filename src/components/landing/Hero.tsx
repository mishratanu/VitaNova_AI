import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield } from 'lucide-react';

// Inline phone mockup — shows the app's triage UI
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      {/* Glow behind phone */}
      <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-110" />

      {/* Phone frame */}
      <div className="relative bg-ink rounded-[2.5rem] p-2 shadow-2xl">
        <div className="bg-[#FAF9F6] rounded-[2rem] overflow-hidden" style={{ height: 560 }}>
          {/* Status bar */}
          <div className="bg-primary h-10 flex items-center justify-between px-6">
            <span className="text-white/80 text-[10px] font-medium">9:41 AM</span>
            <div className="w-16 h-5 bg-ink/40 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-1" />
            <div className="flex gap-1">
              {[1,2,3].map(i=><div key={i} className="w-1 bg-white/60 rounded-full" style={{height: 4+i*2}} />)}
            </div>
          </div>

          {/* App header */}
          <div className="bg-primary px-5 pt-3 pb-5">
            <p className="text-white/70 text-xs font-medium mb-1">VitaNova AI</p>
            <h3 className="text-white font-heading font-bold text-base leading-tight">
              What symptoms are you experiencing?
            </h3>
            {/* Language toggle mini */}
            <div className="flex gap-2 mt-3">
              <span className="bg-white text-primary text-xs font-semibold px-3 py-1 rounded-full">English</span>
              <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">हिंदी</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-4 space-y-3">
            {/* Symptom chips */}
            <div className="flex flex-wrap gap-2">
              {['Fever', 'Headache', 'Cough', 'Weakness'].map((s, i) => (
                <span
                  key={s}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium border
                    ${i === 0
                      ? 'bg-primary text-white border-primary'
                      : 'bg-primary-50 text-primary border-primary-100'
                    }`}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Textarea placeholder */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-xs text-ink-muted leading-relaxed">
              "I have had a high fever for 3 days, severe headache and body aches..."
            </div>

            {/* Pregnancy toggle */}
            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
              <span className="text-xs font-medium text-amber-800">Pregnancy care mode</span>
              <div className="w-9 h-5 bg-amber-400 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow" />
              </div>
            </div>

            {/* AI result card */}
            <div className="bg-severity-red-bg border border-severity-red-border rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">🔴</span>
                <span className="text-xs font-bold text-severity-red">Emergency — Act Now</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                High fever with pregnancy danger signs detected. Immediate care needed.
              </p>
            </div>

            {/* SOS button */}
            <button className="w-full bg-severity-red text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2">
              🚨 Call Emergency — 108
            </button>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-8 top-24 bg-white rounded-2xl shadow-card-hover px-3.5 py-2.5 flex items-center gap-2 border border-gray-100/80"
      >
        <span className="text-xl">🟢</span>
        <div>
          <p className="text-xs font-bold text-ink leading-tight">Safe at home</p>
          <p className="text-[10px] text-ink-muted">Rest & fluids</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute -right-4 top-8 rounded-2xl shadow-lg border border-lime-200/80 px-4 py-3 flex flex-col items-center min-w-[90px]"
        style={{ backgroundColor: '#E8FF8C' }}
      >
        <span className="text-2xl font-extrabold font-heading leading-none" style={{ color: '#224000' }}>65%</span>
        <span className="text-[10px] font-semibold text-center leading-tight mt-0.5" style={{ color: '#224000', opacity: 0.75 }}>lack nearby doctor</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -right-8 top-56 bg-white rounded-2xl shadow-card-hover px-3.5 py-2.5 flex items-center gap-2 border border-gray-100/80"
      >
        <Shield size={16} className="text-primary" />
        <div>
          <p className="text-xs font-bold text-ink leading-tight">AI Verified</p>
          <p className="text-[10px] text-ink-muted">Clinically safe</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="min-h-screen bg-[#FAF9F6] pt-16 flex items-center overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary-50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-max w-full mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — copy */}
          <div className="space-y-6 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 bg-primary-50 text-primary text-sm font-semibold px-4 py-2 rounded-full border border-primary-100 mb-4">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
                AI Health Triage for Rural India
              </span>

              {/* Social proof avatars — above heading */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">
                  {['👨🏽‍🦳', '👩🏾', '🧑🏽‍🦱', '👩🏽'].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center text-base shadow-sm"
                      style={{ zIndex: 4 - i }}
                    >
                      {emoji}
                    </div>
                  ))}
                  <div
                    className="w-9 h-9 rounded-full bg-primary text-white border-2 border-white flex items-center justify-center text-[11px] font-extrabold shadow-sm"
                    style={{ zIndex: 0 }}
                  >
                    +1k
                  </div>
                </div>
                <p className="text-sm text-ink-muted"><span className="font-bold text-ink">1,200+</span> people guided safely</p>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-5xl font-heading font-bold text-ink leading-tight text-balance">
                Your health,{' '}
                <span className="text-primary">explained simply.</span>{' '}
                <span className="text-ink-muted">आपकी सेहत, सरल भाषा में।</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-ink-muted leading-relaxed"
            >
              Describe symptoms in Hindi or English — VitaNova AI asks the right questions and tells you exactly what to do next, from home care to emergency SOS.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link to="/app" id="hero-cta" className="btn-primary text-base px-8 py-4">
                Start Free Triage
                <ArrowRight size={18} />
              </Link>
              <a
                href="#solution"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold rounded-2xl border-2 border-lime-200/80 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md active:scale-[0.98] cursor-pointer"
                style={{ backgroundColor: '#E8FF8C', color: '#224000' }}
              >
                See How It Works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-3 pt-2"
            >
              <div className="flex flex-wrap items-center gap-4">
                {[
                  { icon: '🔒', label: 'Privacy first' },
                  { icon: '🏥', label: 'Clinically guided' },
                  { icon: '🌐', label: 'Hindi + English' },
                ].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5 text-sm text-ink-muted">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {[
                  { icon: '🔒', label: 'No data stored' },
                  { icon: '⚡', label: 'Free forever' },
                  { icon: '🌐', label: 'Works on slow networks' },
                ].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5 text-sm text-ink-muted">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Stat chips row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-4 mt-2 border-t border-gray-100 flex flex-wrap items-center gap-3"
            >
              {[
                { value: '65%', label: 'Rural Indians lack nearby doctor', bg: '#E8FF8C', color: '#224000' },
                { value: '< 30s', label: 'Average triage time', bg: '#E8FF8C', color: '#224000' },
              ].map((stat) => (
                <div
                  key={stat.value}
                  className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 shadow-sm border border-lime-200/60"
                  style={{ backgroundColor: stat.bg }}
                >
                  <span className="text-xl font-extrabold font-heading leading-none" style={{ color: stat.color }}>{stat.value}</span>
                  <span className="text-[11px] font-semibold leading-tight max-w-[80px]" style={{ color: stat.color, opacity: 0.8 }}>{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <PhoneMockup />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
