import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MisTareasClient } from './MisTareasClient'

export default async function MisTareasPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tareasRaw } = await supabase
    .from('tareas')
    .select('id, titulo, fecha_limite, estado, obra_id, obras(nombre)')
    .eq('asignado_a', user.id)
    .order('fecha_limite', { ascending: true, nullsFirst: false })

  const tareas = (tareasRaw ?? []).map((t: any) => ({
    id: t.id,
    titulo: t.titulo,
    fecha_limite: t.fecha_limite,
    estado: t.estado,
    obra_id: t.obra_id,
    obra_nombre: t.obras?.nombre ?? '-',
  }))

  return <MisTareasClient tareas={tareas} />
}
