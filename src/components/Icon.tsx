'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'

export type IconName = 'martini-figure-1' | 'martini-figure-2' | 'branch' | 'shell' | 'email' | 'phone' | 'location' | 'facebook' | 'instagram'

interface IconProps {
  name: IconName
  className?: string
  width?: number
  height?: number
}

export default function Icon({ name, className = '', width = 24, height = 24 }: IconProps) {
  const { theme } = useTheme()
  
  const getIconPath = () => {
    try {
      // First try to load from icons directory
      return `/images/icons/${name}.svg`
    } catch {
      console.error(`Icon ${name} not found`)
      return '/images/icons/placeholder.svg'
    }
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <Image
        src={getIconPath()}
        alt={`${name} icon`}
        width={width}
        height={height}
        className={`object-contain ${theme === 'dark' ? 'invert' : 'invert-0'}`}
        priority
      />
    </div>
  )
} 