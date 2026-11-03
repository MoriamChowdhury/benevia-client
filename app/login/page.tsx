"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

function getRedirect() {
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  return redirect && redirect.startsWith("/") && !redirect.startsWith("//")
    ? redirect
    : "/";
}

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
    router.push(getRedirect());
  }

  async function handleGoogle() {
    try {
      sessionStorage.setItem("welcomeToast", "1");
    } catch {}
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: getRedirect(),
    });
    if (error) {
      toast.error(error.message || "Google login failed");
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h1 className="text-center text-3xl font-bold">Welcome back</h1>

          <label className="label">Email</label>
          <input name="email" type="email" required className="input input-bordered w-full" placeholder="you@example.com" />

          <label className="label">Password</label>
          <input name="password" type="password" required className="input input-bordered w-full" placeholder="Password" />

          <button type="submit" disabled={loading} className="btn btn-primary mt-4">
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="divider">OR</div>

          <button
            type="button"
            onClick={handleGoogle}
            className="btn btn-outline"
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continue with Google
          </button>

          <p className="mt-2 text-center text-sm">
            New to Benevia?{" "}
            <Link href="/register" className="link link-primary">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
}