'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { iniciarTarea, terminarTarea } from '@/app/mis-tareas/actions'

type TareaProps = {
  id: string
  titulo: string
  fecha_limite: string | null
  estado: string
  obra_id: string
  obra_nombre?: string
}

export function TareaCard({ tarea }: { tarea: TareaProps }) {
  const { t } = useI18n()
  const [editando, setEditando] = useState<'iniciar' | 'terminar' | null>(null)
  const [observacion, setObservacion] = useState('')
  const [cargando, setCargando] = useState(false)

  const colorEstado: Record<string, string> = {
    pendiente: 'border-l-neutral-500',
    progreso: 'border-l-orange-500',
    hecho: 'border-l-green-500',
  }

  async function confirmar() {
    setCargando(true)
    if (editando === 'iniciar') {
      await iniciarTarea(tarea.id, tarea.obra_id, observacion)
    } else if (editando === 'terminar') {
      await terminarTarea(tarea.id, tarea.obra_id, observacion)
    }
    setCargando(false)
    setEditando(null)
    setObservacion('')
  }

  return (
    <div
      className={`bg-neutral-900 border border-neutral-800 border-l-2 ${colorEstado[tarea.estado]} rounded-lg px-4 py-3 mb-3`}
    >
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="text-sm font-medium">{tarea.titulo}</p>
          {tarea.obra_nombre && (
            <p className="text-xs text-neutral-500 mt-0.5">{tarea.obra_nombre}</p>
          )}
          <p className="text-xs font-mono text-neutral-600 mt-1">
            {t('fechaLimite')}: {tarea.fecha_limite ?? t('sinFecha')}
          </p>
        </div>

        {tarea.estado === 'hecho' && (
          <span className="text-xs font-mono text-green-500 whitespace-nowrap">
            ✓ {t('tareaTerminada')}
          </span>
        )}
        {tarea.estado === 'pendiente' && !editando && (
          <button
            onClick={() => setEditando('iniciar')}
            className="text-xs bg-orange-600 hover:bg-orange-500 text-white font-medium rounded px-3 py-1.5 whitespace-nowrap"
          >
            {t('iniciarTarea')}
          </button>
        )}
        {tarea.estado === 'progreso' && !editando && (
          <button
            onClick={() => setEditando('terminar')}
            className="text-xs bg-green-700 hover:bg-green-600 text-white font-medium rounded px-3 py-1.5 whitespace-nowrap"
          >
            {t('terminarTarea')}
          </button>
        )}
      </div>

      {editando && (
        <div className="mt-3 pt-3 border-t border-neutral-800">
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            placeholder={t('observacionPh')}
            rows={2}
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm mb-2 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setEditando(null)
                setObservacion('')
              }}
              className="text-xs text-neutral-400 px-3 py-1.5"
            >
              {t('cancelar2')}
            </button>
            <button
              onClick={confirmar}
              disabled={cargando}
              className="text-xs bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-medium rounded px-3 py-1.5"
            >
              {t('guardar')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}