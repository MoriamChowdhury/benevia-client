"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import { EVENT_TYPES } from "@/lib/eventTypes";
import { EventItem } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (type !== "all") params.set("type", type);

        const res = await fetch(`${API}/events?${params.toString()}`);
        if (!res.ok) throw new Error();
        setEvents(await res.json());
      } catch {
        toast.error("Could not load events. Please try again");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, type]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Upcoming Events</h1>
        <p className="mt-2 opacity-70">
          Find a social service event near you and be a part of the change.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-3 md:flex-row md:justify-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events by title"
          className="input input-bordered w-full md:max-w-sm"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="select select-bordered w-full md:max-w-xs"
        >
          <option value="all">All types</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <p className="py-20 text-center text-lg opacity-70">
          No upcoming events found. Try a different search.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event._id}
              id={event._id}
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