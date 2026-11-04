export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorEmail: string;
  creatorName: string;
    participants?: number;
}

export interface JoinedItem {
  _id: string;
  eventId: string;
  title: string;
  thumbnail: string;
  location: string;
  eventType: string;
  eventDate: string;
  joinedAt: string;
}