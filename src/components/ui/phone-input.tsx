'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { COUNTRIES, DEFAULT_COUNTRY, countryOf, toE164, type Country } from '@/lib/auth/phone'
import { cn } from '@/lib/utils'

interface PhoneInputProps {
  /** E.164 (`+2348035550142`) or `''`. */
  value: string
  /** Always called with E.164, or `''` when the field is cleared. */
  onChange: (e164: string) => void
  id?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

/**
 * International phone field: dialling code + national number, emitting E.164.
 * Pasting a full number (`+44 …`, `00234 …`) switches the country to match.
 */
export function PhoneInput({ value, onChange, id, placeholder = '803 555 0142', className, disabled }: PhoneInputProps) {
  const [picked, setPicked] = useState<Country>(() => countryOf(value) ?? DEFAULT_COUNTRY)
  const country = (value && countryOf(value)) || picked
  const national = value ? value.slice(1 + country.dial.length) : ''

  const type = (text: string) => {
    const e = toE164(text, country)
    const c = countryOf(e)
    if (c && c.iso !== country.iso && /^\s*(\+|00)/.test(text)) setPicked(c)
    onChange(e)
  }

  return (
    // The wrapper owns the height (40px, or whatever `className` sets, e.g. `h-11`);
    // the code picker and the number field both fill it, so they always line up.
    <div className={cn('flex h-10 items-stretch gap-1.5', className)}>
      <Select
        value={country.iso}
        disabled={disabled}
        onValueChange={(iso) => {
          const c = COUNTRIES.find((x) => x.iso === iso) ?? DEFAULT_COUNTRY
          setPicked(c)
          if (national) onChange(`+${c.dial}${national}`)
        }}
      >
        {/* `data-[size=default]:h-full` beats the trigger's own `data-[size=default]:h-9`. */}
        <SelectTrigger className="w-[104px] shrink-0 h-full data-[size=default]:h-full items-center tnum" aria-label="Country code">
          <SelectValue>
            <span className="flex items-center gap-1.5 leading-none"><span className="text-base leading-none">{country.flag}</span>+{country.dial}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map((c) => (
            <SelectItem key={c.iso} value={c.iso}><span className="tnum">{c.flag} +{c.dial}</span> <span className="text-muted-foreground text-xs">{c.name}</span></SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        id={id}
        value={national}
        onChange={(e) => type(e.target.value)}
        placeholder={placeholder}
        inputMode="tel"
        autoComplete="tel-national"
        disabled={disabled}
        className="tnum flex-1 min-w-0 h-full"
      />
    </div>
  )
}
