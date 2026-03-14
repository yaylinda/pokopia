interface StatTileProps {
  label: string
  value: string
  caption: string
}

export function StatTile({ caption, label, value }: StatTileProps) {
  return (
    <article className="stat-tile">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{caption}</span>
    </article>
  )
}
