'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'horizontal' | 'vertical';
  linkWrapper?: boolean;
}

export default function Logo({ 
  className = '', 
  variant = 'horizontal',
  linkWrapper = true 
}: LogoProps) {
  const dimensions = variant === 'horizontal' 
    ? { width: 800, height: 240 }
    : { width: 600, height: 600 };

  const image = (
    <Image
      src={variant === 'vertical' ? '/images/logo-vertical.png' : '/images/logo-horizontal.png'}
      alt="Pique Unique"
      {...dimensions}
      style={{ 
        objectFit: 'contain',
        width: '100%',
        height: 'auto',
        maxHeight: variant === 'horizontal' ? '110px' : '300px'
      }}
      priority
      className=""
    />
  );

  if (linkWrapper) {
    return (
      <Link href="/" className={`relative flex items-center ${className}`}>
        {image}
      </Link>
    );
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      {image}
    </div>
  );
} 