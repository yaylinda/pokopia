interface FilterSelectProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export function FilterSelect({ label, onChange, options, value }: FilterSelectProps) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
