"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      className="mt-6 rounded-lg border border-zinc-300 px-4 py-2 font-medium"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Cerrar sesión
    </button>
  );
}
