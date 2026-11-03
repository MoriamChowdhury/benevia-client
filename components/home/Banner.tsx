import Link from "next/link";

export default function Banner() {
  return (
    <section
      className="text-primary-content"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center md:py-28">
        <span className="rounded-full border border-current px-4 py-1 text-sm font-medium">
          Community-driven social service
        </span>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
          Small acts of kindness, one event at a time
        </h1>

        <p className="max-w-2xl text-lg opacity-90">
          Benevia brings neighbours together. Organize a winter clothes drive,
          join a tree plantation or help clean your local park, all in a few clicks.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link href="/events" className="btn btn-lg bg-base-100 text-base-content border-none">
            Explore Events
          </Link>
          <Link href="/create-event" className="btn btn-lg btn-outline border-current text-primary-content">
            Create an Event
          </Link>
        </div>
      </div>
    </section>
  );
}