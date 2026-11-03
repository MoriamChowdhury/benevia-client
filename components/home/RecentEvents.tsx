"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import SectionHeading from "@/components/SectionHeading";
import { EventItem } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function RecentEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`${API}/events?limit=6`);
        if (!res.ok) throw new Error();
        setEvents(await res.json());
      } catch {
        toast.error("Could not load upcoming events");
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        title="Recent Upcoming Events"
        subtitle="Pick an event, show up and make a real difference in your community."
      />

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-10">
          <p className="text-lg opacity-70">
            No upcoming events yet. Be the first to organize one!
          </p>
          <Link href="/create-event" className="btn btn-primary">
            Create an Event
          </Link>
        </div>
      ) : (
        <>
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
          <div className="mt-10 text-center">
            <Link href="/events" className="btn btn-outline btn-primary">
              View All Events
            </Link>
          </div>
        </>
      )}
    </section>
  );
}