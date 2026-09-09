"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/tickets");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-semibold">Log in</h1>

      {error && (
        <p className="text-red-500 text-sm border border-red-200 bg-red-50 rounded px-3 py-2">
          {error}
        </p>
      )}

      <input name="email" type="email" placeholder="Email" required className="w-full border rounded px-3 py-2" />
      <input name="password" type="password" placeholder="Password" required className="w-full border rounded px-3 py-2" />

      <button type="submit" disabled={loading} className="w-full bg-black text-white rounded px-3 py-2 disabled:opacity-50">
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}