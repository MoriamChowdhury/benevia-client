"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import PrivateRoute from "@/components/PrivateRoute";
import { getToken } from "@/lib/api";
import { JoinedItem } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function JoinedEventsPage() {
  return (
    <PrivateRoute>
      <JoinedEvents />
    </PrivateRoute>
  );
}

function JoinedEvents() {
  const [events, setEvents] = useState<JoinedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJoined() {
      try {
        const token = await getToken();
        if (!token) {
          toast.error("Session expired. Please login again");
          return;
        }
        const res = await fetch(`${API}/joined`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        setEvents(await res.json());
      } catch {
        toast.error("Could not load your joined events");
      } finally {
        setLoading(false);
      }
    }
    loadJoined();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Joined Events</h1>
        <p className="mt-2 opacity-70">
          Events you have joined, sorted by event date.
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
          <p className="text-lg opacity-70">You have not joined any events yet.</p>
          <Link href="/events" className="btn btn-primary">
            Explore upcoming events
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event._id}
              id={event.eventId}
              title={event.title}
              thumbnail={event.thumbnail}
              location={event.location}
              eventType={event.eventType}
              eventDate={event.eventDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}