"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string).trim();
    const email = (form.get("email") as string).trim();
    const photoURL = (form.get("photoURL") as string).trim();
    const password = form.get("password") as string;

    if (!/[A-Z]/.test(password)) {
      return toast.error("Password must have at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      return toast.error("Password must have at least one lowercase letter");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      image: photoURL,
    });
    setLoading(false);

    if (error) {
      return toast.error(error.message || "Registration failed");
    }
    toast.success("Registration successful! Welcome to Benevia");
    router.push("/");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center">Create your account</h1>

          <label className="label">Name</label>
          <input name="name" type="text" required className="input input-bordered w-full" placeholder="Your name" />

          <label className="label">Email</label>
          <input name="email" type="email" required className="input input-bordered w-full" placeholder="you@example.com" />

          <label className="label">Photo URL</label>
          <input name="photoURL" type="url" required className="input input-bordered w-full" placeholder="https://..." />

          <label className="label">Password</label>
          <input name="password" type="password" required className="input input-bordered w-full" placeholder="Password" />

          <button type="submit" disabled={loading} className="btn btn-primary mt-4">
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="text-center text-sm mt-2">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
}