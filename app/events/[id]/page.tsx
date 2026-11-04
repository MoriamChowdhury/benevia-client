"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getToken } from "@/lib/api";
import { formatDate } from "@/lib/formatDate";
import { EventItem } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [joined, setJoined] = useState(false);

  const fetchEvent = useCallback(async () => {
    const res = await fetch(`${API}/events/${id}`);
    if (!res.ok) {
      setNotFound(true);
      return;
    }
    setEvent(await res.json());
  }, [id]);

  useEffect(() => {
    fetchEvent()
      .catch(() => {
        toast.error("Could not load event details");
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [fetchEvent]);

  useEffect(() => {
    if (!userEmail) {
      setJoined(false);
      return;
    }
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch(`${API}/joined/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setJoined(Boolean(data.joined));
        }
      } catch {
        // status check is optional, ignore errors
      }
    })();
  }, [userEmail, id]);

  async function handleJoin() {
    if (!session) {
      toast.error("Please login to join this event");
      router.push(`/login?redirect=/events/${id}`);
      return;
    }

    setBusy(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Session expired. Please login again");
        return;
      }

      const res = await fetch(`${API}/joined`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: id }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setJoined(true);
        toast("You have already joined this event", { icon: "ℹ️" });
        return;
      }
      if (!res.ok) {
        toast.error(data.message || "Could not join the event");
        return;
      }

      setJoined(true);
      toast.success("You have joined this event!");
      await fetchEvent();
    } catch {
      toast.error("Could not reach the server. Please try again");
    } finally {
      setBusy(false);
    }
  }

  async function handleLeave() {
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Session expired. Please login again");
        return;
      }

      const res = await fetch(`${API}/joined/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Could not leave the event");
        return;
      }

      setJoined(false);
      toast.success("You have left this event");
      await fetchEvent();
    } catch {
      toast.error("Could not reach the server. Please try again");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="skeleton h-72 w-full md:h-96" />
        <div className="skeleton mt-6 h-8 w-2/3" />
        <div className="skeleton mt-4 h-4 w-1/3" />
        <div className="skeleton mt-6 h-32 w-full" />
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Link href="/events" className="btn btn-primary">
          Browse upcoming events
        </Link>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-CA");
  const eventEnded = event.eventDate.slice(0, 10) < today;
  const participants = event.participants ?? 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <img
        src={event.thumbnail}
        alt={event.title}
        className="h-72 w-full rounded-2xl object-cover shadow-md md:h-96"
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="badge badge-primary badge-outline">{event.eventType}</span>
        <span className="text-sm opacity-70">📅 {formatDate(event.eventDate)}</span>
        <span className="text-sm opacity-70">📍 {event.location}</span>
        <span className="text-sm opacity-70">
          👥 {participants} {participants === 1 ? "person has" : "people have"} joined
        </span>
      </div>

      <h1 className="mt-4 text-3xl font-bold md:text-4xl">{event.title}</h1>

      <p className="mt-2 text-sm opacity-70">
        Organized by {event.creatorName || event.creatorEmail}
      </p>

      <p className="mt-6 whitespace-pre-line leading-relaxed">{event.description}</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {eventEnded ? (
          <button className="btn btn-disabled">This event has ended</button>
        ) : joined ? (
          <>
            <button className="btn btn-success btn-disabled">Joined ✓</button>
            <button
              onClick={handleLeave}
              disabled={busy}
              className="btn btn-outline btn-error"
            >
              {busy ? "Leaving..." : "Leave Event"}
            </button>
            <Link href="/joined-events" className="btn btn-outline">
              View my joined events
            </Link>
          </>
        ) : (
          <button
            onClick={handleJoin}
            disabled={busy}
            className="btn btn-primary btn-lg"
          >
            {busy ? "Joining..." : "Join Event"}
          </button>
        )}
      </div>
    </div>
  );
}