import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

interface EventCardProps {
  id: string;
  title: string;
  thumbnail: string;
  location: string;
  eventType: string;
  eventDate: string;
}

export default function EventCard({
  id,
  title,
  thumbnail,
  location,
  eventType,
  eventDate,
}: EventCardProps) {
  return (
    <div className="card h-full bg-base-100 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <figure className="h-48 w-full">
        <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
      </figure>
      <div className="card-body">
        <div className="badge badge-primary badge-outline">{eventType}</div>
        <h2 className="card-title line-clamp-2">{title}</h2>
        <p className="text-sm opacity-80">📍 {location}</p>
        <p className="text-sm opacity-80">📅 {formatDate(eventDate)}</p>
        <div className="card-actions mt-auto justify-end pt-2">
          <Link href={`/events/${id}`} className="btn btn-primary btn-sm">
            View Event
          </Link>
        </div>
      </div>
    </div>
  );
}