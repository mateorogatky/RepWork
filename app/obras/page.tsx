import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cerrarSesion } from './actions'
import { ObrasClient } from './ObrasClient'

export default async function ObrasPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: obras, error } = await supabase
    .from('obras')
    .select('id, nombre, cliente, direccion, fecha_inicio, estado')
    .order('created_at', { ascending: false })

  const { data: perfil } = await supabase
    .from('profiles')
    .select('nombre, rol')
    .eq('id', user.id)
    .single()

  return (
    <ObrasClient
      nombre={perfil?.nombre ?? user.email ?? ''}
      obras={obras ?? []}
      errorMsg={error?.message ?? null}
      cerrarSesion={cerrarSesion}
      esAdmin={perfil?.rol === 'admin'}
    />
  )
}