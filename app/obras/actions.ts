'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function crearObra(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user!.id)
    .single()

  if (perfil?.rol !== 'admin') {
    console.error('Intento de crear obra sin permisos de admin')
    return
  }

  const nombre = formData.get('nombre') as string
  const cliente = formData.get('cliente') as string
  const direccion = formData.get('direccion') as string

  const { error } = await supabase.from('obras').insert({
    nombre,
    cliente: cliente || null,
    direccion: direccion || null,
    owner_id: user!.id,
  })

  if (error) {
    // En un MVP más adelante conviene mostrar esto en la UI en vez de solo loguearlo
    console.error('Error creando obra:', error.message)
    return
  }

  revalidatePath('/obras')
}

export async function cerrarSesion() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function cambiarIdioma(idioma: 'es' | 'en' | 'pt') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('profiles').update({ idioma }).eq('id', user.id)
}