'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SparklesProps extends React.SVGProps<SVGSVGElement> {
  count?: number
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Sparkles component - renders decorative animated sparkles
 * Used around featured elements like tier progression or event cards
 */
export function Sparkles({
  count = 4,
  color = 'currentColor',
  size = 'md',
  className,
  ...props
}: SparklesProps) {
  // Determine size in pixels
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
  }
  const pixelSize = sizeMap[size]

  // Generate sparkle positions
  const sparkles = Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * Math.PI * 2
    const radius = 50
    const x = Math.round((Math.cos(angle) * radius + 50) * 100) / 100
    const y = Math.round((Math.sin(angle) * radius + 50) * 100) / 100
    const delay = (i / count) * 0.5 // Stagger animation start

    return {
      id: i,
      x,
      y,
      delay,
      duration: 2 + (i % 2) * 0.5, // Vary duration slightly
    }
  })

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 100 100"
      className={cn('shrink-0 overflow-visible', className)}
      {...props}
    >
      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .sparkle-item {
          animation: sparkle var(--duration, 2s) ease-in-out var(--delay, 0s) infinite;
          transform-origin: 50% 50%;
        }
      `}</style>

      {sparkles.map(({ id, x, y, delay, duration }) => (
        <g
          key={id}
          className="sparkle-item"
          style={
            {
              '--delay': `${delay}s`,
              '--duration': `${duration}s`,
            } as React.CSSProperties
          }
        >
          {/* Diamond-shaped sparkle */}
          <path
            d={`M ${x} ${y - 4} L ${x + 4} ${y} L ${x} ${y + 4} L ${x - 4} ${y} Z`}
            fill={color}
            opacity="0.8"
          />
        </g>
      ))}
    </svg>
  )
}

export default Sparkles
