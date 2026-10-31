import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <span className="text-sm font-semibold uppercase tracking-[0.25em] text-fuchsia-700">Lola Monster Makeup</span>
      <h1 className="mt-5 text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">Tu espacio de maquillaje comienza aquí.</h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">Proyecto inicial conectado a Neon Postgres y Neon Auth. Entra a tu cuenta para continuar.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/auth/sign-in" className="rounded-lg bg-zinc-950 px-5 py-3 font-medium text-white">Iniciar sesión</Link>
        <Link href="/auth/sign-up" className="rounded-lg border border-zinc-300 px-5 py-3 font-medium text-zinc-950">Crear cuenta</Link>
        <Link href="/account" className="rounded-lg border border-zinc-300 px-5 py-3 font-medium text-zinc-950">Mi cuenta</Link>
      </div>
    </main>
  );
}
