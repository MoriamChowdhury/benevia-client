import Link from "next/link";

export default function Banner() {
  return (
    <section
      className="relative bg-cover bg-center"
      style={{ backgroundImage: "url('/banner.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-36">
        <div className="max-w-2xl text-white">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
            Community-driven social service
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
            Small acts of kindness, one event at a time
          </h1>

          <p className="mt-5 text-lg text-white/85">
            Benevia brings neighbours together. Organize a winter clothes drive,
            join a tree plantation or help clean your local park, all in a few clicks.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/events" className="btn btn-primary btn-lg">
              Explore Events
            </Link>
            <Link
              href="/create-event"
              className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-black"
            >
              Create an Event
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}