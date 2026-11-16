import { useState } from 'react';
import { Leaf } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function ResilientImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full bg-gradient-to-br from-[#143D2B] via-[#1B4D36] to-[#285E43] flex flex-col items-center justify-center p-6 text-center text-[#FAF9F5]"
      >
        <div className="w-12 h-12 rounded-full border border-[#D99B16]/50 bg-[#0C261A]/50 flex items-center justify-center mb-3">
          <Leaf className="w-5 h-5 text-[#EAB308]" />
        </div>
        <span className="font-display text-base font-semibold tracking-tight">
          {fallbackLabel || alt}
        </span>
        <span className="text-xs text-[#E6E1D6]/80 mt-1">ZESTARA FOODS</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
