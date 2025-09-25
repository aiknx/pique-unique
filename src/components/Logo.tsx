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
        quality={65}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        priority
      />
    </div>
  );
} 