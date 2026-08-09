import { registrar } from './actions'

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; mensaje?: string }>
}) {
  const { error, mensaje } = await searchParams
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-lg p-8">
        <h1 className="text-xl font-semibold text-neutral-100 mb-1">Crear cuenta</h1>
        <p className="text-sm text-neutral-400 mb-6">Empezá a gestionar tus obras</p>

        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm text-neutral-300 mb-1">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 text-sm"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-neutral-300 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 text-sm"
              placeholder="nombre@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-neutral-300 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 text-sm"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          {mensaje && (
            <p className="text-sm text-green-400">{mensaje}</p>
          )}

          <button
            formAction={registrar}
            className="mt-2 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded px-4 py-2 text-sm"
          >
            Crear cuenta
          </button>
        </form>

        <p className="text-sm text-neutral-400 mt-6 text-center">
          ¿Ya tenés cuenta?{' '}
          <a href="/login" className="text-orange-500 hover:underline">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  )
}