'use client'

import { useState } from 'react'
import {
  agregarTarea,
  moverTarea,
  agregarMaterial,
  marcarMaterialEstado,
  agregarNota,
  invitarMiembro,
  quitarMiembro,
} from './actions'
import { useI18n } from '@/lib/i18n/I18nProvider'

type Tarea = {
  id: string
  titulo: string
  fecha_limite: string | null
  estado: string
  asignado_a: string | null
}
type Material = {
  id: string
  nombre: string
  cantidad_necesaria: number
  cantidad_comprada: number
  costo_unitario: number
  proveedor: string | null
  estado: string
}
type Nota = {
  id: string
  texto: string
  created_at: string
  autor_id: string
  autor_nombre: string
}
type MiembroEquipo = {
  id: string
  nombre: string
  esOwner: boolean
}

export function ObraTabs({
  obraId,
  tareas,
  materiales,
  notas,
  equipo,
  isOwner,
}: {
  obraId: string
  tareas: Tarea[]
  materiales: Material[]
  notas: Nota[]
  equipo: MiembroEquipo[]
  isOwner: boolean
}) {
  const [tab, setTab] = useState<'tareas' | 'materiales' | 'bitacora' | 'equipo'>('tareas')
  const { t } = useI18n()

  const tabLabel = {
    tareas: t('tabTareas'),
    materiales: t('tabMateriales'),
    bitacora: t('tabBitacora'),
    equipo: t('tabEquipo'),
  }

  return (
    <div>
      <div className="flex gap-1 border-b border-neutral-800 mb-5 overflow-x-auto">
        {(['tareas', 'materiales', 'bitacora', 'equipo'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-2.5 text-sm font-medium -mb-px border-b-2 whitespace-nowrap shrink-0 ${
              tab === k
                ? 'text-neutral-100 border-orange-500'
                : 'text-neutral-500 border-transparent hover:text-neutral-200'
            }`}
          >
            {tabLabel[k]}
          </button>
        ))}
      </div>

      {tab === 'tareas' && <Kanban obraId={obraId} tareas={tareas} equipo={equipo} />}
      {tab === 'materiales' && <Materiales obraId={obraId} materiales={materiales} />}
      {tab === 'bitacora' && <Bitacora obraId={obraId} notas={notas} />}
      {tab === 'equipo' && (
        <Equipo obraId={obraId} equipo={equipo} isOwner={isOwner} />
      )}
    </div>
  )
}

function Kanban({
  obraId,
  tareas,
  equipo,
}: {
  obraId: string
  tareas: Tarea[]
  equipo: MiembroEquipo[]
}) {
  const { t } = useI18n()
  const [filtroAsignado, setFiltroAsignado] = useState('')
  const cols = [
    { key: 'pendiente', label: t('colTodo') },
    { key: 'progreso', label: t('colProgreso') },
    { key: 'hecho', label: t('colHecho') },
  ] as const
  const orden = ['pendiente', 'progreso', 'hecho']
  const colorBorde: Record<string, string> = {
    pendiente: 'border-l-neutral-500',
    progreso: 'border-l-orange-500',
    hecho: 'border-l-green-500',
  }
  const nombrePorId = (id: string | null) =>
    equipo.find((m) => m.id === id)?.nombre ?? t('sinAsignar')

  const tareasFiltradas = filtroAsignado
    ? tareas.filter((tarea) => tarea.asignado_a === filtroAsignado)
    : tareas

  return (
    <div>
      <form
        action={(fd) => agregarTarea(obraId, fd)}
        className="flex flex-wrap gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-3 mb-3"
      >
        <input
          name="titulo"
          required
          placeholder={t('tituloTareaPh')}
          className="flex-[2] min-w-[180px] bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
        />
        <select
          name="asignado_a"
          defaultValue=""
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-300"
        >
          <option value="">{t('sinAsignar')}</option>
          {equipo.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
        <input
          name="fecha_limite"
          type="date"
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-300"
        />
        <button className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded px-4 py-2">
          {t('agregarTarea')}
        </button>
      </form>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-mono uppercase text-neutral-500">
          {t('filtrarPorTrabajador')}
        </span>
        <select
          value={filtroAsignado}
          onChange={(e) => setFiltroAsignado(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-sm text-neutral-300"
        >
          <option value="">{t('todos')}</option>
          {equipo.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cols.map((c) => {
          const items = tareasFiltradas.filter((tarea) => tarea.estado === c.key)
          const idx = orden.indexOf(c.key)
          return (
            <div key={c.key} className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 min-h-[100px]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono uppercase tracking-wide text-neutral-400">
                  {c.label}
                </span>
                <span className="text-xs font-mono text-neutral-500 bg-neutral-800 rounded-full px-2">
                  {items.length}
                </span>
              </div>
              {items.length === 0 && (
                <p className="text-xs text-neutral-600 italic">{t('sinTareas')}</p>
              )}
              {items.map((tarea) => (
                <div
                  key={tarea.id}
                  className={`bg-neutral-800 border border-neutral-700 border-l-2 ${colorBorde[tarea.estado]} rounded px-3 py-2 mb-2`}
                >
                  <p className="text-sm mb-1.5">{tarea.titulo}</p>
                  <p className="text-xs text-neutral-500 mb-1.5">{nombrePorId(tarea.asignado_a)}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-neutral-500">
                      {tarea.fecha_limite ?? '-'}
                    </span>
                    <div className="flex gap-1">
                      {idx > 0 && (
                        <button
                          onClick={() => moverTarea(obraId, tarea.id, orden[idx - 1])}
                          className="text-xs border border-neutral-700 rounded px-1.5 text-neutral-400 hover:border-orange-500 hover:text-orange-500"
                        >
                          ←
                        </button>
                      )}
                      {idx < 2 && (
                        <button
                          onClick={() => moverTarea(obraId, tarea.id, orden[idx + 1])}
                          className="text-xs border border-neutral-700 rounded px-1.5 text-neutral-400 hover:border-orange-500 hover:text-orange-500"
                        >
                          →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Materiales({ obraId, materiales }: { obraId: string; materiales: Material[] }) {
  const { t } = useI18n()
  const chip: Record<string, string> = {
    falta: 'bg-red-950 text-red-400',
    pedido: 'bg-yellow-950 text-yellow-400',
    entregado: 'bg-green-950 text-green-400',
  }

  return (
    <div>
      <form
        action={(fd) => agregarMaterial(obraId, fd)}
        className="flex flex-wrap gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-3 mb-5"
      >
        <input
          name="nombre"
          required
          placeholder={t('matNombrePh')}
          className="flex-[2] min-w-[140px] bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
        />
        <input
          name="cantidad_necesaria"
          type="number"
          placeholder={t('matNecesariaPh')}
          className="w-32 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
        />
        <input
          name="costo_unitario"
          type="number"
          placeholder={t('matCostoPh')}
          className="w-32 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
        />
        <input
          name="proveedor"
          placeholder={t('matProveedorPh')}
          className="flex-1 min-w-[120px] bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
        />
        <button className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded px-4 py-2">
          {t('agregarMaterial')}
        </button>
      </form>

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="text-left text-xs font-mono uppercase text-neutral-500 border-b border-neutral-800">
            <th className="py-2">{t('thMaterial')}</th>
            <th className="py-2">{t('thComprado')}</th>
            <th className="py-2">{t('thCosto')}</th>
            <th className="py-2">{t('thProveedor')}</th>
            <th className="py-2">{t('thEstado')}</th>
          </tr>
        </thead>
        <tbody>
          {materiales.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-neutral-600 text-xs italic">
                {t('sinMateriales')}
              </td>
            </tr>
          )}
          {materiales.map((m) => (
            <tr key={m.id} className="border-b border-neutral-900">
              <td className="py-2.5">{m.nombre}</td>
              <td className="py-2.5 font-mono text-neutral-400">
                {m.cantidad_comprada} / {m.cantidad_necesaria}
              </td>
              <td className="py-2.5 font-mono text-neutral-400">
                ${m.costo_unitario.toLocaleString()}
              </td>
              <td className="py-2.5 text-neutral-400">{m.proveedor ?? '-'}</td>
              <td className="py-2.5">
                <select
                  defaultValue={m.estado}
                  onChange={(e) => marcarMaterialEstado(obraId, m.id, e.target.value)}
                  className={`text-xs font-mono rounded-full px-2 py-1 border-0 ${chip[m.estado]}`}
                >
                  <option value="falta">{t('stFalta')}</option>
                  <option value="pedido">{t('stPedido')}</option>
                  <option value="entregado">{t('stEntregado')}</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

function Bitacora({ obraId, notas }: { obraId: string; notas: Nota[] }) {
  const { t } = useI18n()
  return (
    <div>
      <form
        action={(fd) => agregarNota(obraId, fd)}
        className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 mb-5"
      >
        <input
          name="texto"
          required
          placeholder={t('notaPh')}
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm mb-2"
        />
        <div className="flex justify-end">
          <button className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded px-4 py-1.5">
            {t('agregarNota')}
          </button>
        </div>
      </form>

      {notas.length === 0 && (
        <p className="text-xs text-neutral-600 italic">{t('sinNotas')}</p>
      )}
      {[...notas].reverse().map((n) => (
        <div key={n.id} className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{n.autor_nombre}</span>
            <span className="text-xs font-mono text-neutral-500">
              {new Date(n.created_at).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-neutral-400">{n.texto}</p>
        </div>
      ))}
    </div>
  )
}

function Equipo({
  obraId,
  equipo,
  isOwner,
}: {
  obraId: string
  equipo: MiembroEquipo[]
  isOwner: boolean
}) {
  const { t } = useI18n()
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  return (
    <div>
      {isOwner && (
        <form
          action={async (fd) => {
            setCargando(true)
            setError(null)
            const res = await invitarMiembro(obraId, fd)
            setError(res?.error ?? null)
            setCargando(false)
          }}
          className="flex flex-wrap gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-3 mb-3"
        >
          <input
            name="email"
            type="email"
            required
            placeholder={t('invitarEmailPh')}
            className="flex-1 min-w-[220px] bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
          />
          <button
            disabled={cargando}
            className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-medium rounded px-4 py-2"
          >
            {cargando ? t('invitando') : t('invitar')}
          </button>
        </form>
      )}

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {!isOwner && (
        <p className="text-xs text-neutral-500 mb-4">{t('soloAdminInvita')}</p>
      )}

      <p className="text-xs text-neutral-500 mb-2">{t('debeExistirCuenta')}</p>

      <div className="grid gap-2">
        {equipo.map((m) => (
          <div
            key={m.id}
            className="flex justify-between items-center bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5"
          >
            <span className="text-sm">
              {m.nombre}
              {m.esOwner && (
                <span className="ml-2 text-xs font-mono text-orange-500 uppercase">{t('admin')}</span>
              )}
            </span>
            {isOwner && !m.esOwner && (
              <button
                onClick={() => quitarMiembro(obraId, m.id)}
                className="text-xs text-neutral-500 hover:text-red-400"
              >
                {t('quitar')}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}