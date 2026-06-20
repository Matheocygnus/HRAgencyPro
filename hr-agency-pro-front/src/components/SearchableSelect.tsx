import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Option {
  value: number
  label: string
}

interface SearchableSelectProps {
  options: Option[]
  value: number | undefined
  onChange: (value: number | undefined) => void
  placeholder?: string
  isInvalid?: boolean
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Search...',
  isInvalid = false,
}: SearchableSelectProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const userIsEditingRef = useRef(false)

  // Sync display text when value changes externally (edit mode, contract auto-fill, reset)
  useEffect(() => {
    if (userIsEditingRef.current) return
    if (value) {
      const found = options.find(o => o.value === value)
      if (found) setQuery(found.label)
    } else {
      setQuery('')
    }
  }, [value, options])

  // Close dropdown on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        userIsEditingRef.current = false
        if (!value) setQuery('')
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [value])

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(query.toLowerCase())
  )

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    userIsEditingRef.current = true
    setQuery(e.target.value)
    setOpen(true)
    if (value) onChange(undefined)
  }

  function handleSelect(option: Option) {
    userIsEditingRef.current = false
    onChange(option.value)
    setQuery(option.label)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className={[
          'input w-full pr-8',
          isInvalid ? 'border-danger focus:border-danger focus:ring-danger' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      />
      <ChevronDown
        className={[
          'pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted transition-transform duration-150',
          open ? 'rotate-180' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {open && (
        <ul
          className="searchable-select-dropdown absolute z-[9999] mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-divider shadow-2xl"
          style={{ backgroundColor: 'var(--surface, oklch(0.20 0.008 264))' }}
        >
          {filtered.length > 0 ? (
            filtered.map(option => (
              <li
                key={option.value}
                onMouseDown={() => handleSelect(option)}
                className={[
                  'searchable-select-option cursor-pointer px-3 py-2 text-sm transition-colors',
                  value === option.value ? 'font-medium text-primary' : 'text-foreground',
                ].join(' ')}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-muted">No results found</li>
          )}
        </ul>
      )}
    </div>
  )
}
