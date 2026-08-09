'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function iniciarTarea(tareaId: string, obraId: string, observacion: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('tareas')
    .update({ estado: 'progreso', iniciada_at: new Date().toISOString() })
    .eq('id', tareaId)

  if (observacion?.trim()) {
    await supabase.from('notas').insert({
      obra_id: obraId,
      tarea_id: tareaId,
      autor_id: user.id,
      texto: observacion.trim(),
    })
  }

  revalidatePath('/mis-tareas')
  revalidatePath(`/obras/${obraId}`)
}

export async function terminarTarea(tareaId: string, obraId: string, observacion: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('tareas')
    .update({ estado: 'hecho', terminada_at: new Date().toISOString() })
    .eq('id', tareaId)

  if (observacion?.trim()) {
    await supabase.from('notas').insert({
      obra_id: obraId,
      tarea_id: tareaId,
      autor_id: user.id,
      texto: observacion.trim(),
    })
  }

  revalidatePath('/mis-tareas')
  revalidatePath(`/obras/${obraId}`)
}
