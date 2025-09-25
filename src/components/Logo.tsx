'use client';

import Image from 'next/image';

interface LogoProps {
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

export default function Logo({ className = '', variant = 'horizontal' }: LogoProps) {
  const dimensions = variant === 'horizontal' 
    ? { width: 800, height: 240 } // Adjusted from original to be more realistic for display
    : { width: 300, height: 300 }; // Adjusted from original to be more realistic for display

  return (
    <div className={`relative flex items-center ${className}`}>
      <Image
        src={variant === 'vertical' ? '/images/logo-vertical.png' : '/images/logo-horizontal.png'}
        alt="Pique Unique"
        {...dimensions}
        style={{ 
          objectFit: 'contain',
          width: '100%',
          height: 'auto',
          maxHeight: variant === 'horizontal' ? '120px' : '300px'
        }}
        priority
      />
    </div>
  );
} 