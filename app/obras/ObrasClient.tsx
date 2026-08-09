'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { LangSwitch } from '@/components/LangSwitch'
import { CrearObraForm } from './CrearObraForm'

type Obra = {
  id: string
  nombre: string
  cliente: string | null
  direccion: string | null
  estado: string
}

export function ObrasClient({
  nombre,
  obras,
  errorMsg,
  cerrarSesion,
  esAdmin,
}: {
  nombre: string
  obras: Obra[]
  errorMsg: string | null
  cerrarSesion: () => Promise<void>
  esAdmin: boolean
}) {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold tracking-wide uppercase">
            Rep<span className="text-orange-500">work</span>
          </p>
          <p className="text-xs text-neutral-500">
            {t('hola')}, {nombre}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/mis-tareas"
            className="text-xs md:text-sm text-neutral-400 hover:text-neutral-100 border border-neutral-800 rounded px-2.5 md:px-3 py-1.5"
          >
            {t('misTareas')}
          </Link>
          <LangSwitch />
          <form action={cerrarSesion}>
            <button className="text-xs md:text-sm text-neutral-400 hover:text-neutral-100 border border-neutral-800 rounded px-2.5 md:px-3 py-1.5">
              {t('cerrarSesion')}
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">{t('tusObras')}</h1>
        </div>

        {esAdmin && <CrearObraForm />}

        {errorMsg && <p className="text-sm text-red-400 mb-4">{errorMsg}</p>}

        {obras.length === 0 && (
          <div className="text-center py-16 text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
            <p className="text-neutral-300 font-medium mb-1">{t('sinObrasTitulo')}</p>
            <p className="text-sm">{t('sinObrasSub')}</p>
          </div>
        )}

        <div className="grid gap-3 mt-4">
          {obras.map((obra) => (
            <Link
              key={obra.id}
              href={`/obras/${obra.id}`}
              className="block bg-neutral-900 border border-neutral-800 hover:border-orange-600 rounded-lg px-5 py-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{obra.nombre}</p>
                  <p className="text-sm text-neutral-400">
                    {obra.direccion} — {obra.cliente}
                  </p>
                </div>
                <span className="text-xs font-mono text-neutral-500 uppercase">
                  {obra.estado}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}