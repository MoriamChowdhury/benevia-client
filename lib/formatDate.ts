export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}