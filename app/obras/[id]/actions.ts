'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function agregarTarea(obraId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const titulo = formData.get('titulo') as string
  const fecha_limite = (formData.get('fecha_limite') as string) || null
  const asignado_a = (formData.get('asignado_a') as string) || null

  await supabase.from('tareas').insert({
    obra_id: obraId,
    titulo,
    fecha_limite,
    asignado_a,
    created_by: user.id,
    estado: 'pendiente',
  })

  revalidatePath(`/obras/${obraId}`)
}

export async function invitarMiembro(obraId: string, formData: FormData) {
  const supabase = await createClient()
  const email = (formData.get('email') as string)?.trim()
  if (!email) return { error: 'Ingresá un email' }

  const { data: encontrado, error: rpcError } = await supabase.rpc(
    'buscar_usuario_por_email',
    { email_buscado: email }
  )

  if (rpcError || !encontrado || encontrado.length === 0) {
    return { error: 'No existe ninguna cuenta registrada con ese email' }
  }

  const usuarioId = encontrado[0].id

  const { error: insertError } = await supabase
    .from('obra_miembros')
    .insert({ obra_id: obraId, usuario_id: usuarioId })

  if (insertError) {
    if (insertError.code === '23505') {
      return { error: 'Esa persona ya es parte de la obra' }
    }
    return { error: 'No se pudo agregar: ' + insertError.message }
  }

  revalidatePath(`/obras/${obraId}`)
  return { error: null }
}

export async function quitarMiembro(obraId: string, usuarioId: string) {
  const supabase = await createClient()
  await supabase
    .from('obra_miembros')
    .delete()
    .eq('obra_id', obraId)
    .eq('usuario_id', usuarioId)
  revalidatePath(`/obras/${obraId}`)
}

export async function moverTarea(obraId: string, tareaId: string, estado: string) {
  const supabase = await createClient()
  await supabase.from('tareas').update({ estado }).eq('id', tareaId)
  revalidatePath(`/obras/${obraId}`)
}

export async function agregarMaterial(obraId: string, formData: FormData) {
  const supabase = await createClient()

  const nombre = formData.get('nombre') as string
  const cantidad_necesaria = Number(formData.get('cantidad_necesaria')) || 0
  const costo_unitario = Number(formData.get('costo_unitario')) || 0
  const proveedor = (formData.get('proveedor') as string) || null

  await supabase.from('materiales').insert({
    obra_id: obraId,
    nombre,
    cantidad_necesaria,
    costo_unitario,
    proveedor,
    estado: 'falta',
  })

  revalidatePath(`/obras/${obraId}`)
}

export async function marcarMaterialEstado(obraId: string, materialId: string, estado: string) {
  const supabase = await createClient()
  await supabase.from('materiales').update({ estado }).eq('id', materialId)
  revalidatePath(`/obras/${obraId}`)
}

export async function agregarNota(obraId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const texto = formData.get('texto') as string
  if (!texto?.trim()) return

  await supabase.from('notas').insert({
    obra_id: obraId,
    autor_id: user.id,
    texto,
  })

  revalidatePath(`/obras/${obraId}`)
}
