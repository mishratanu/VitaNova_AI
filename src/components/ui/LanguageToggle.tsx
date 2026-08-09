import type { Language } from '../../types';

interface LanguageToggleProps {
  language: Language;
  onChange: (lang: Language) => void;
  className?: string;
}

export default function LanguageToggle({ language, onChange, className = '' }: LanguageToggleProps) {
  return (
    <div
      className={`inline-flex items-center rounded-xl border border-gray-200 bg-white p-1 gap-1 ${className}`}
      role="group"
      aria-label="Select language"
    >
      <button
        id="lang-en"
        onClick={() => onChange('en')}
        aria-pressed={language === 'en'}
        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 min-h-[36px] min-w-[60px]
          ${language === 'en'
            ? 'bg-primary text-white shadow-sm'
            : 'text-ink-muted hover:text-primary hover:bg-primary-50'
          }`}
      >
        English
      </button>
      <button
        id="lang-hi"
        onClick={() => onChange('hi')}
        aria-pressed={language === 'hi'}
        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 min-h-[36px] min-w-[60px]
          ${language === 'hi'
            ? 'bg-primary text-white shadow-sm'
            : 'text-ink-muted hover:text-primary hover:bg-primary-50'
          }`}
      >
        हिंदी
      </button>
    </div>
  );
}
