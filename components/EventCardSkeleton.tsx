export default function EventCardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="skeleton h-48 w-full rounded-b-none" />
      <div className="card-body gap-3">
        <div className="skeleton h-5 w-24" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton mt-2 h-8 w-28 self-end" />
      </div>
    </div>
  );
}