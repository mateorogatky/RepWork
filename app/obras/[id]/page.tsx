import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ObraTabs } from './ObraTabs'
import { ObraTrabajadorView } from './ObraTrabajadorView'
import { ObraTopBar, ObraTitleBlock } from './ObraHeader'

export default async function ObraPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: obra } = await supabase
    .from('obras')
    .select('id, nombre, cliente, direccion, fecha_inicio, owner_id')
    .eq('id', id)
    .single()

  if (!obra) notFound()

  const { data: tareas } = await supabase
    .from('tareas')
    .select('id, titulo, fecha_limite, estado, asignado_a')
    .eq('obra_id', obra.id)
    .order('created_at', { ascending: true })

  const { data: materiales } = await supabase
    .from('materiales')
    .select('id, nombre, cantidad_necesaria, cantidad_comprada, costo_unitario, proveedor, estado')
    .eq('obra_id', obra.id)
    .order('created_at', { ascending: true })

  const { data: notasRaw } = await supabase
    .from('notas')
    .select('id, texto, created_at, autor_id, profiles(nombre)')
    .eq('obra_id', obra.id)
    .order('created_at', { ascending: true })

  const notas = (notasRaw ?? []).map((n: any) => ({
    id: n.id,
    texto: n.texto,
    created_at: n.created_at,
    autor_id: n.autor_id,
    autor_nombre: n.profiles?.nombre ?? 'Usuario',
  }))

  const { data: ownerProfile } = await supabase
    .from('profiles')
    .select('id, nombre')
    .eq('id', obra.owner_id)
    .single()

  const { data: miembrosRaw } = await supabase
    .from('obra_miembros')
    .select('usuario_id, profiles(nombre)')
    .eq('obra_id', obra.id)

  const equipo = [
    ...(ownerProfile ? [{ id: ownerProfile.id, nombre: ownerProfile.nombre, esOwner: true }] : []),
    ...(miembrosRaw ?? []).map((m: any) => ({
      id: m.usuario_id,
      nombre: m.profiles?.nombre ?? 'Usuario',
      esOwner: false,
    })),
  ]

  const isOwner = obra.owner_id === user.id

  const misTareasEnObra = (tareas ?? [])
    .filter((t) => t.asignado_a === user.id)
    .map((t) => ({
      id: t.id,
      titulo: t.titulo,
      fecha_limite: t.fecha_limite,
      estado: t.estado,
      obra_id: obra.id,
    }))

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <ObraTopBar />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <ObraTitleBlock
          nombre={obra.nombre}
          direccion={obra.direccion}
          cliente={obra.cliente}
          fechaInicio={obra.fecha_inicio}
          totalTareas={tareas?.length ?? 0}
          totalMateriales={materiales?.length ?? 0}
        />

        {isOwner ? (
          <ObraTabs
            obraId={obra.id}
            tareas={tareas ?? []}
            materiales={materiales ?? []}
            notas={notas}
            equipo={equipo}
            isOwner={isOwner}
          />
        ) : (
          <ObraTrabajadorView tareas={misTareasEnObra} />
        )}
      </main>
    </div>
  )
}