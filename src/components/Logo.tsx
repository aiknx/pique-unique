import Image from 'next/image'

interface LogoProps {
  variant?: 'horizontal' | 'vertical'
  className?: string
}

export default function Logo({ variant = 'horizontal', className = '' }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={`/images/logo-${variant}.png`}
        alt="Pique Unique"
        width={variant === 'horizontal' ? 200 : 150}
        height={variant === 'horizontal' ? 50 : 150}
        className="object-contain"
        priority
      />
    </div>
  )
} 