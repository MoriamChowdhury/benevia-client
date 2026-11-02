"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  async function handleLogout() {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
  }

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 md:px-8">
      <div className="flex-1">
        <Link href="/" className="text-2xl font-bold text-primary">
          Benevia
        </Link>
      </div>

      <div className="flex items-center gap-2">
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
                className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
              >
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