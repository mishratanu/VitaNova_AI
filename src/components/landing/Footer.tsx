import { Link } from 'react-router-dom';
import { Heart, ExternalLink } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-primary text-white" role="contentinfo">
      <div className="container-max px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-4">
            <Logo light size="md" />
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              AI-powered health triage for rural India — bilingual, safe, and free.
            </p>
            <p className="text-white/50 text-xs">
              ⚠️ VitaNova AI is a triage assistant, not a diagnostic tool. Always consult a qualified healthcare professional for medical decisions.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <p className="font-heading font-semibold text-white/90 text-sm mb-4">Navigate</p>
            {[
              { label: 'Try the App', to: '/app' },
              { label: 'How It Works', href: '/#solution' },
              { label: 'Features', href: '/#features' },
              { label: 'Safety Layer', href: '/#safety' },
            ].map((link) =>
              link.to ? (
                <Link key={link.label} to={link.to} className="block text-sm text-white/70 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} className="block text-sm text-white/70 hover:text-white transition-colors">
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <p className="font-heading font-semibold text-white/90 text-sm mb-4">Get started now</p>
            <p className="text-white/70 text-sm">Describe your symptoms in 30 seconds. Get a clear, safe answer — free, always.</p>
            <Link to="/app" className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-5 py-3 rounded-xl hover:bg-primary-50 transition-colors">
              Open VitaNova AI <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-white/50 text-xs flex items-center gap-1.5">
            Built with <Heart size={12} className="text-accent" fill="currentColor" /> for rural India · 2025
          </p>
          <p className="text-white/50 text-xs text-center">
            Medical Disclaimer: This tool is for informational triage only. It does not diagnose, prescribe, or replace professional medical advice. In emergencies, call <strong className="text-white/70">108</strong>.
          </p>
        </div>
      </div>
    </footer>
  );
}
