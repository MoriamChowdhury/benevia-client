"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    try {
      if (user && sessionStorage.getItem("welcomeToast")) {
        sessionStorage.removeItem("welcomeToast");
        toast.success("Login successful! Welcome to Benevia");
      }
    } catch {}
  }, [user]);

  async function handleLogout() {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
  }

  return (
    <div className="navbar sticky top-0 z-50 bg-base-100 px-4 shadow-sm md:px-8">
      <div className="flex-1">
        <Link href="/" className="text-2xl font-bold text-primary">
          Benevia
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Link href="/events" className="btn btn-ghost">
          Upcoming Events
        </Link>

        {isPending ? null : user ? (
          <>
            <div className="dropdown dropdown-end">
              <div className="tooltip tooltip-bottom" data-tip={user.name}>
                <div tabIndex={0} role="button" className="avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={
                        user.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
                      }
                      alt={user.name}
                    />
                  </div>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-10 mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
              >
                <li><Link href="/profile">My Profile</Link></li>
                <li><Link href="/create-event">Create Event</Link></li>
                <li><Link href="/manage-events">Manage Events</Link></li>
                <li><Link href="/joined-events">Joined Events</Link></li>
              </ul>
            </div>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}