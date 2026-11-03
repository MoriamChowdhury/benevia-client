"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  );
}

function Profile() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string).trim();
    const image = (form.get("image") as string).trim();

    if (name.length < 2) {
      return toast.error("Name must be at least 2 characters long");
    }
    try {
      new URL(image);
    } catch {
      return toast.error("Please enter a valid photo URL");
    }

    setSaving(true);
    const { error } = await authClient.updateUser({ name, image });
    setSaving(false);

    if (error) {
      return toast.error(error.message || "Could not update profile");
    }
    toast.success("Profile updated successfully!");
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <div className="avatar">
            <div className="w-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
              <img
                src={
                  user.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
                }
                alt={user.name}
              />
            </div>
          </div>
          <h1 className="mt-3 text-2xl font-bold">{user.name}</h1>
          <p className="text-sm opacity-70">{user.email}</p>

          <form onSubmit={handleSubmit} className="mt-6 w-full">
            <label className="label">Name</label>
            <input
              name="name"
              type="text"
              required
              defaultValue={user.name}
              className="input input-bordered w-full"
            />

            <label className="label mt-2">Photo URL</label>
            <input
              name="image"
              type="url"
              required
              defaultValue={user.image || ""}
              className="input input-bordered w-full"
            />

            <label className="label mt-2">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="input input-bordered w-full"
            />

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary mt-6 w-full"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}