"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import { getToken } from "@/lib/api";
import { formatDate } from "@/lib/formatDate";
import { EventItem } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ManageEventsPage() {
  return (
    <PrivateRoute>
      <ManageEvents />
    </PrivateRoute>
  );
}

function ManageEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadMyEvents() {
      try {
        const token = await getToken();
        if (!token) {
          toast.error("Session expired. Please login again");
          return;
        }
        const res = await fetch(`${API}/my-events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        setEvents(await res.json());
      } catch {
        toast.error("Could not load your events");
      } finally {
        setLoading(false);
      }
    }
    loadMyEvents();
  }, []);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Session expired. Please login again");
        return;
      }
      const res = await fetch(`${API}/events/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Could not delete the event");
        return;
      }

      setEvents((prev) => prev.filter((e) => e._id !== deleteTarget._id));
      toast.success("Event deleted successfully");
      setDeleteTarget(null);
    } catch {
      toast.error("Could not reach the server. Please try again");
    } finally {
      setDeleting(false);
    }
  }

  const today = new Date().toLocaleDateString("en-CA");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Manage Events</h1>
        <p className="mt-2 opacity-70">
          Update or delete the events you have created.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20">
          <p className="text-lg opacity-70">You have not created any events yet.</p>
          <Link href="/create-event" className="btn btn-primary">
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const ended = event.eventDate.slice(0, 10) < today;
            return (
              <div
                key={event._id}
                className="card h-full bg-base-100 shadow-md"
              >
                <figure className="h-48 w-full">
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <div className="flex flex-wrap gap-2">
                    <div className="badge badge-primary badge-outline">
                      {event.eventType}
                    </div>
                    {ended && <div className="badge badge-neutral">Ended</div>}
                  </div>
                  <h2 className="card-title line-clamp-2">{event.title}</h2>
                  <p className="text-sm opacity-80">📍 {event.location}</p>
                  <p className="text-sm opacity-80">
                    📅 {formatDate(event.eventDate)}
                  </p>
                  <div className="card-actions mt-auto justify-end gap-2 pt-2">
                    <Link
                      href={`/manage-events/${event._id}/edit`}
                      className="btn btn-outline btn-primary btn-sm"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(event)}
                      className="btn btn-outline btn-error btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deleteTarget && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Delete this event?</h3>
            <p className="py-4">
              <span className="font-semibold">{deleteTarget.title}</span> will be
              permanently deleted, and everyone who joined it will lose it from
              their joined events. This cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                disabled={deleting}
                onClick={confirmDelete}
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}