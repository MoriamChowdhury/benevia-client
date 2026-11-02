"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import { getToken } from "@/lib/api";
import { EVENT_TYPES } from "@/lib/eventTypes";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CreateEventPage() {
  return (
    <PrivateRoute>
      <CreateEventForm />
    </PrivateRoute>
  );
}

function CreateEventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

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

    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Session expired. Please login again");
        return;
      }

      const res = await fetch(`${API}/events`, {
        method: "POST",
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
        toast.error(data.message || "Failed to create event");
        return;
      }

      toast.success("Event created successfully!");
      router.push("/events");
    } catch {
      toast.error("Could not reach the server. Please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center">Create a New Event</h1>
          <p className="text-center text-sm opacity-70">
            Organize a social service event and bring your community together.
          </p>

          <label className="label mt-2">Event Title</label>
          <input
            name="title"
            type="text"
            required
            className="input input-bordered w-full"
            placeholder="Winter Clothes Distribution"
          />

          <label className="label">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            className="textarea textarea-bordered w-full"
            placeholder="Tell people what this event is about and how they can help"
          />

          <label className="label">Event Type</label>
          <select
            name="eventType"
            required
            defaultValue=""
            className="select select-bordered w-full"
          >
            <option value="" disabled>
              Select event type
            </option>
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
            className="input input-bordered w-full"
            placeholder="https://..."
          />

          <label className="label">Location</label>
          <input
            name="location"
            type="text"
            required
            className="input input-bordered w-full"
            placeholder="Mirpur 10, Dhaka"
          />

          <label className="label">Event Date</label>
          <input
            name="eventDate"
            type="date"
            required
            min={today}
            className="input input-bordered w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary mt-4"
          >
            {loading ? "Creating event..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}