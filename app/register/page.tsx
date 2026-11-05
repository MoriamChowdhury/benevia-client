"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/Logo";

const RULES = [
  { label: "At least one uppercase letter (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
  { label: "At least one lowercase letter (a-z)", test: (p: string) => /[a-z]/.test(p) },
  { label: "At least 6 characters long", test: (p: string) => p.length >= 6 },
];

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 opacity-60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState("");
  const [photoBroken, setPhotoBroken] = useState(false);

  const passed = RULES.filter((rule) => rule.test(password)).length;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string).trim();
    const email = (form.get("email") as string).trim();
    const photoURL = (form.get("photoURL") as string).trim();
    const pass = form.get("password") as string;

    if (!/[A-Z]/.test(pass)) {
      return toast.error("Password must have at least one uppercase letter");
    }
    if (!/[a-z]/.test(pass)) {
      return toast.error("Password must have at least one lowercase letter");
    }
    if (pass.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name,
      email,
      password: pass,
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
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <div className="flex flex-col items-center gap-2 text-center">
            <Logo />
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="text-sm opacity-70">
              Join Benevia and start making a difference in your community.
            </p>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <label className="input w-full">
                <Icon>
                  <path d="M20 21a8 8 0 1 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </Icon>
                <input name="name" type="text" required placeholder="Your name" className="grow" />
              </label>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <label className="input w-full">
                <Icon>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </Icon>
                <input name="email" type="email" required placeholder="you@example.com" className="grow" />
              </label>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Photo URL</label>
              <label className="input w-full">
                <Icon>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-5-5L5 21" />
                </Icon>
                <input
                  name="photoURL"
                  type="url"
                  required
                  placeholder="https://..."
                  className="grow"
                  value={photo}
                  onChange={(e) => {
                    setPhoto(e.target.value);
                    setPhotoBroken(false);
                  }}
                />
              </label>
              {photo && !photoBroken && (
                <img
                  src={photo}
                  alt="Profile preview"
                  onError={() => setPhotoBroken(true)}
                  className="mt-3 h-14 w-14 rounded-full object-cover ring ring-primary ring-offset-2 ring-offset-base-100"
                />
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <label className="input w-full">
                <Icon>
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </Icon>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a password"
                  className="grow"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-xs font-semibold text-primary"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </label>

              <progress
                className={`progress mt-3 w-full ${
                  passed === 3
                    ? "progress-success"
                    : passed === 0
                      ? "progress-error"
                      : "progress-warning"
                }`}
                value={passed}
                max={3}
              />

              <ul className="mt-3 space-y-1 text-sm">
                {RULES.map((rule) => {
                  const ok = rule.test(password);
                  return (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-2 transition ${
                        ok ? "font-medium text-success" : "opacity-60"
                      }`}
                    >
                      <span className="w-4 text-center">{ok ? "✓" : "○"}</span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary mt-6">
            {loading && <span className="loading loading-spinner loading-sm" />}
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="mt-2 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary font-medium">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}