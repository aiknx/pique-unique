'use client';

import Image from 'next/image';

interface LogoProps {
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

export default function Logo({ className = '', variant = 'horizontal' }: LogoProps) {
  const dimensions = variant === 'horizontal' 
    ? { width: 176, height: 110 } // Actual displayed dimensions to optimize loading
    : { width: 150, height: 150 }; // Smaller for vertical variant

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
        quality={70}
        priority
      />
    </div>
  );
} 