'use client'

import { useI18n } from '@/lib/i18n/I18nProvider'
import { TareaCard } from '@/components/TareaCard'

type Tarea = {
  id: string
  titulo: string
  fecha_limite: string | null
  estado: string
  obra_id: string
}

export function ObraTrabajadorView({ tareas }: { tareas: Tarea[] }) {
  const { t } = useI18n()

  const disponibles = tareas.filter((x) => x.estado !== 'hecho')
  const terminadas = tareas.filter((x) => x.estado === 'hecho')

  return (
    <div>
      {tareas.length === 0 && (
        <div className="text-center py-16 text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
          <p>{t('sinTareasAsignadas')}</p>
        </div>
      )}

      {disponibles.map((tarea) => (
        <TareaCard key={tarea.id} tarea={tarea} />
      ))}

      {terminadas.length > 0 && (
        <div className="mt-8 pt-4 border-t border-neutral-800">
          {terminadas.map((tarea) => (
            <TareaCard key={tarea.id} tarea={tarea} />
          ))}
        </div>
      )}
    </div>
  )
}