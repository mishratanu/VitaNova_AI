import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  light?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ light = false, size = 'md' }: LogoProps) {
  const sizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' };
  const iconSizes = { sm: 16, md: 20, lg: 24 };

  return (
    <Link to="/" className="inline-flex items-center gap-2 group focus-visible:outline-primary">
      <span className={`flex items-center justify-center w-8 h-8 rounded-lg
        ${light ? 'bg-white/20' : 'bg-primary'} transition-transform group-hover:scale-105`}
        style={{ minWidth: iconSizes[size] + 16 }}
      >
        <Heart
          size={iconSizes[size]}
          className={light ? 'text-white' : 'text-white'}
          fill="currentColor"
        />
      </span>
      <span className={`font-heading font-bold ${sizes[size]} ${light ? 'text-white' : 'text-ink'}`}>
        Vita<span className={light ? 'text-white/80' : 'text-primary'}>Nova</span>
        <span className={`text-xs font-body font-medium ml-1 ${light ? 'text-white/60' : 'text-ink-light'}`}>AI</span>
      </span>
    </Link>
  );
}
