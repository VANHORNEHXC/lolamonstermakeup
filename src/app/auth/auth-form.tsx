"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { authClient } from "@/lib/auth/client";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const signingUp = mode === "sign-up";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setNotice("");

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    try {
      const result = signingUp
        ? await authClient.signUp.email({
            name: String(data.get("name") ?? ""),
            email,
            password,
          })
        : await authClient.signIn.email({ email, password });

      if (result.error) {
        setError(result.error.message ?? "No se pudo completar la solicitud.");
        return;
      }

      if (signingUp) {
        setNotice("Cuenta creada. Si se requiere verificación, revisa tu correo antes de entrar.");
      } else {
        router.push("/account");
        router.refresh();
      }
    } catch {
      setError("No se pudo contactar el servicio de autenticación.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Link href="/" className="mb-10 text-sm text-zinc-500 hover:text-zinc-900">
        ← Lola Monster Makeup
      </Link>
      <h1 className="text-3xl font-semibold text-zinc-950">
        {signingUp ? "Crear cuenta" : "Iniciar sesión"}
      </h1>
      <p className="mt-2 text-zinc-600">Accede con tu correo y contraseña.</p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        {signingUp && (
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Nombre
            <input name="name" required autoComplete="name" className="rounded-lg border border-zinc-300 px-3 py-2.5" />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Correo
          <input name="email" type="email" required autoComplete="email" className="rounded-lg border border-zinc-300 px-3 py-2.5" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Contraseña
          <input name="password" type="password" required minLength={8} autoComplete={signingUp ? "new-password" : "current-password"} className="rounded-lg border border-zinc-300 px-3 py-2.5" />
        </label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="text-sm text-green-700">{notice}</p>}
        <button type="submit" disabled={pending} className="rounded-lg bg-zinc-950 px-4 py-3 font-medium text-white disabled:opacity-50">
          {pending ? "Procesando…" : signingUp ? "Crear cuenta" : "Entrar"}
        </button>
      </form>
      <p className="mt-6 text-sm text-zinc-600">
        {signingUp ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
        <Link className="font-medium text-zinc-950 underline" href={signingUp ? "/auth/sign-in" : "/auth/sign-up"}>
          {signingUp ? "Inicia sesión" : "Regístrate"}
        </Link>
      </p>
    </main>
  );
}
