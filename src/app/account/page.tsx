import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth/server";
import { SignOutButton } from "./sign-out-button";

async function AccountContent() {
  await connection();
  const { data: session } = await auth.getSession();

  if (!session?.user) redirect("/auth/sign-in");

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Mi cuenta</h1>
      <p className="mt-4 text-zinc-600">Sesión activa para {session.user.email}.</p>
      <SignOutButton />
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-2xl px-6 py-16">Cargando cuenta…</main>}>
      <AccountContent />
    </Suspense>
  );
}
