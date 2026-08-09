'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { LangSwitch } from '@/components/LangSwitch'
import { TareaCard } from '@/components/TareaCard'

type TareaAsignada = {
  id: string
  titulo: string
  fecha_limite: string | null
  estado: string
  obra_id: string
  obra_nombre: string
}

export function MisTareasClient({ tareas }: { tareas: TareaAsignada[] }) {
  const { t } = useI18n()

  const pendientes = tareas.filter((x) => x.estado === 'pendiente')
  const enProgreso = tareas.filter((x) => x.estado === 'progreso')
  const hechas = tareas.filter((x) => x.estado === 'hecho')

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/obras" className="text-xs text-neutral-500 hover:text-neutral-300">
          ← {t('tusObras')}
        </Link>
        <LangSwitch />
      </header>

      <main className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-xl font-semibold mb-1">{t('misTareas')}</h1>
        <p className="text-sm text-neutral-500 mb-6">{t('misTareasSub')}</p>

        {tareas.length === 0 && (
          <div className="text-center py-16 text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
            <p>{t('sinTareasAsignadas')}</p>
          </div>
        )}

        {[...enProgreso, ...pendientes].map((tarea) => (
          <TareaCard key={tarea.id} tarea={tarea} />
        ))}

        {hechas.length > 0 && (
          <div className="mt-8 pt-4 border-t border-neutral-800">
            {hechas.map((tarea) => (
              <TareaCard key={tarea.id} tarea={tarea} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}