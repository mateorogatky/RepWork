'use client'

import { useI18n } from '@/lib/i18n/I18nProvider'
import type { Idioma } from '@/lib/i18n/translations'

const OPCIONES: { code: Idioma; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
]

export function LangSwitch() {
  const { idioma, setIdioma } = useI18n()

  return (
    <div className="flex gap-0.5 border border-neutral-800 rounded p-0.5">
      {OPCIONES.map((o) => (
        <button
          key={o.code}
          onClick={() => setIdioma(o.code)}
          className={`text-xs font-mono px-2 py-1 rounded ${
            idioma === o.code
              ? 'bg-orange-900/40 text-orange-400'
              : 'text-neutral-500 hover:text-neutral-200'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}