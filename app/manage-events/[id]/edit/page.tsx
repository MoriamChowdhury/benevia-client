"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import { authClient } from "@/lib/auth-client";
import { getToken } from "@/lib/api";
import { EVENT_TYPES } from "@/lib/eventTypes";
import { EventItem } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function UpdateEventPage() {
  return (
    <PrivateRoute>
      <UpdateEventForm />
    </PrivateRoute>
  );
}

function UpdateEventForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const today = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch(`${API}/events/${id}`);
        if (!res.ok) return;
        setEvent(await res.json());
      } catch {
        toast.error("Could not load the event");
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = (form.get("title") as string).trim();
    const description = (form.get("description") as string).trim();
    const eventType = form.get("eventType") as string;
    const thumbnail = (form.get("thumbnail") as string).trim();
    const location = (form.get("location") as string).trim();
    const eventDate = form.get("eventDate") as string;

    if (title.length < 5) {
      return toast.error("Title must be at least 5 characters long");
    }
    if (description.length < 20) {
      return toast.error("Description must be at least 20 characters long");
    }
    if (!eventType) {
      return toast.error("Please select an event type");
    }
    try {
      new URL(thumbnail);
    } catch {
      return toast.error("Please enter a valid thumbnail image URL");
    }
    if (!eventDate || eventDate < today) {
      return toast.error("Event date cannot be in the past");
    }

    setSaving(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Session expired. Please login again");
        return;
      }

      const res = await fetch(`${API}/events/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          eventType,
          thumbnail,
          location,
          eventDate,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update event");
        return;
      }

      toast.success("Event updated successfully!");
      router.push("/manage-events");
    } catch {
      toast.error("Could not reach the server. Please try again");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="skeleton h-[32rem] w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Link href="/manage-events" className="btn btn-primary">
          Back to Manage Events
        </Link>
      </div>
    );
  }

  if (session && event.creatorEmail !== session.user.email) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold">You can only update your own events</h1>
        <Link href="/manage-events" className="btn btn-primary">
          Back to Manage Events
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-center text-3xl font-bold">Update Event</h1>

          <label className="label mt-2">Event Title</label>
          <input
            name="title"
            type="text"
            required
            defaultValue={event.title}
            className="input input-bordered w-full"
          />

          <label className="label">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            defaultValue={event.description}
            className="textarea textarea-bordered w-full"
          />

          <label className="label">Event Type</label>
          <select
            name="eventType"
            required
            defaultValue={event.eventType}
            className="select select-bordered w-full"
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <label className="label">Thumbnail Image URL</label>
          <input
            name="thumbnail"
            type="url"
            required
            defaultValue={event.thumbnail}
            className="input input-bordered w-full"
          />

          <label className="label">Location</label>
          <input
            name="location"
            type="text"
            required
            defaultValue={event.location}
            className="input input-bordered w-full"
          />

          <label className="label">Event Date</label>
          <input
            name="eventDate"
            type="date"
            required
            min={today}
            defaultValue={event.eventDate.slice(0, 10)}
            className="input input-bordered w-full"
          />

          <div className="mt-4 flex gap-3">
            <Link href="/manage-events" className="btn flex-1">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex-1"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}