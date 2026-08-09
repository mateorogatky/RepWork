'use client'

import { createContext, useContext, useState, useTransition } from 'react'
import { I18N, type Idioma, type TranslationKey } from './translations'
import { cambiarIdioma } from '@/app/obras/actions'

type I18nContextType = {
  idioma: Idioma
  t: (key: TranslationKey) => string
  setIdioma: (i: Idioma) => void
  cambiando: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({
  idiomaInicial,
  children,
}: {
  idiomaInicial: Idioma
  children: React.ReactNode
}) {
  const [idioma, setIdiomaState] = useState<Idioma>(idiomaInicial)
  const [cargando, startTransition] = useTransition()

  function setIdioma(nuevo: Idioma) {
    setIdiomaState(nuevo) // cambia la UI al instante
    startTransition(() => {
      cambiarIdioma(nuevo) // persiste en el perfil en segundo plano
    })
  }

  function t(key: TranslationKey) {
    return I18N[idioma][key]
  }

  return (
    <I18nContext.Provider value={{ idioma, t, setIdioma, cambiando: cargando }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n debe usarse dentro de un I18nProvider')
  return ctx
}
