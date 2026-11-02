"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = (form.get("email") as string).trim();
    const password = form.get("password") as string;

    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (error) {
      return toast.error(error.message || "Invalid email or password");
    }
    toast.success("Login successful! Welcome back");
   const redirect = new URLSearchParams(window.location.search).get("redirect");
router.push(redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center">Welcome back</h1>

          <label className="label">Email</label>
          <input name="email" type="email" required className="input input-bordered w-full" placeholder="you@example.com" />

          <label className="label">Password</label>
          <input name="password" type="password" required className="input input-bordered w-full" placeholder="Password" />

          <button type="submit" disabled={loading} className="btn btn-primary mt-4">
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm mt-2">
            New to Benevia?{" "}
            <Link href="/register" className="link link-primary">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
}