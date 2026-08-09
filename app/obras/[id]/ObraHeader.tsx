'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { LangSwitch } from '@/components/LangSwitch'

export function ObraTopBar() {
  const { t } = useI18n()
  return (
    <header className="border-b border-neutral-800 px-4 md:px-6 py-3 flex items-center justify-between">
      <Link href="/obras" className="text-xs text-neutral-500 hover:text-neutral-300">
        {t('volverObras')}
      </Link>
      <LangSwitch />
    </header>
  )
}

export function ObraTitleBlock({
  nombre,
  direccion,
  cliente,
  fechaInicio,
  totalTareas,
  totalMateriales,
}: {
  nombre: string
  direccion: string | null
  cliente: string | null
  fechaInicio: string | null
  totalTareas: number
  totalMateriales: number
}) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b-2 border-neutral-800 pb-4 mb-6 gap-3 md:gap-5">
      <div>
        <h1 className="text-2xl font-semibold uppercase tracking-wide">{nombre}</h1>
        <p className="text-sm text-neutral-400">
          {direccion} — {t('cliente')}: {cliente}
        </p>
      </div>
      <div className="text-xs font-mono text-neutral-500 border border-neutral-800 rounded px-3 py-2 text-left md:text-right whitespace-nowrap self-start">
        {t('inicio')} <b className="text-neutral-200">{fechaInicio}</b>
        <br />
        {t('tareasLbl')} <b className="text-neutral-200">{totalTareas}</b> · {t('matLbl')}{' '}
        <b className="text-neutral-200">{totalMateriales}</b>
      </div>
    </div>
  )
}