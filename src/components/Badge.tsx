import type { CSSProperties, ReactNode } from 'react'

type BadgeTone = 'neutral' | 'sun' | 'leaf' | 'ember' | 'wave' | 'night' | 'stone'

interface BadgeProps {
  children: ReactNode
  icon?: ReactNode
  tone?: BadgeTone
  compact?: boolean
  onClick?: () => void
  title?: string
  style?: CSSProperties
}

export function Badge({ children, compact = false, icon, onClick, style, title, tone = 'neutral' }: BadgeProps) {
  const className = `badge badge--${tone}${compact ? ' badge--compact' : ''}${onClick ? ' badge--button' : ''}`

  if (onClick) {
    return (
      <button className={className} onClick={onClick} style={style} title={title} type="button">
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        <span>{children}</span>
      </button>
    )
  }

  return (
    <span className={className} style={style} title={title}>
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span>{children}</span>
    </span>
  )
}
