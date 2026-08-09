'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function registrar(formData: FormData) {
  const supabase = await createClient()

  const nombre = formData.get('nombre') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre }, // lo lee el trigger handle_new_user() para crear el profile
    },
  })

  if (error) {
    redirect(`/registro?error=${encodeURIComponent(error.message)}`)
  }

  redirect(
    `/login?mensaje=${encodeURIComponent('Cuenta creada. Revisá tu email para confirmar.')}`
  )
}