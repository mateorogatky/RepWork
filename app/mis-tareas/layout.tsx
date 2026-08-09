import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { I18nProvider } from '@/lib/i18n/I18nProvider'
import type { Idioma } from '@/lib/i18n/translations'

export default async function MisTareasLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('profiles')
    .select('idioma')
    .eq('id', user.id)
    .single()

  const idiomaInicial = (perfil?.idioma ?? 'es') as Idioma

  return <I18nProvider idiomaInicial={idiomaInicial}>{children}</I18nProvider>
}
