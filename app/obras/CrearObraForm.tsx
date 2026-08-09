'use client'

import { useState } from 'react'
import { crearObra } from './actions'
import { useI18n } from '@/lib/i18n/I18nProvider'

export function CrearObraForm() {
  const [abierto, setAbierto] = useState(false)
  const { t } = useI18n()

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="mb-6 w-full border border-dashed border-neutral-700 hover:border-orange-600 hover:text-orange-500 text-neutral-400 rounded-lg py-3 text-sm"
      >
        {t('nuevaObra')}
      </button>
    )
  }

  return (
    <form
      action={async (formData) => {
        await crearObra(formData)
        setAbierto(false)
      }}
      className="mb-6 bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col gap-3"
    >
      <input
        name="nombre"
        required
        placeholder={t('nombreObraPh')}
        className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="cliente"
          placeholder={t('clientePh')}
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
        />
        <input
          name="direccion"
          placeholder={t('direccionPh')}
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setAbierto(false)}
          className="text-sm text-neutral-400 px-3 py-1.5"
        >
          {t('cancelar')}
        </button>
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded px-4 py-1.5"
        >
          {t('crearObra')}
        </button>
      </div>
    </form>
  )
}