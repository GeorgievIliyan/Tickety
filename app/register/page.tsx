"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    router.push("/tickets");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-semibold">Create an account</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        name="name"
        type="text"
        placeholder="Name"
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        minLength={8}
        className="w-full border rounded px-3 py-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white rounded px-3 py-2 disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}