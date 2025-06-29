'use client';

import { useState } from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import clsx from 'clsx';

interface ImageProps extends Omit<NextImageProps, 'onLoad'> {
  className?: string;
}

export default function Image({ className, src, alt, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={clsx('overflow-hidden', className)}>
      <NextImage
        className={clsx(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
        )}
        src={src}
        alt={alt}
        quality={90}
        loading="lazy"
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
          `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#CCCCCC"/>
          </svg>`
        ).toString('base64')}`}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
} 