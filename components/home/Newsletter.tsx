"use client";

import toast from "react-hot-toast";

export default function Newsletter() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Thanks for subscribing to the Benevia newsletter!");
    e.currentTarget.reset();
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-content md:px-12">
        <h2 className="text-3xl font-bold md:text-4xl">Never miss an event</h2>
        <p className="mx-auto mt-3 max-w-xl opacity-90">
          Subscribe to get new community events and volunteer stories in your inbox.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="input input-bordered w-full text-base-content"
          />
          <button type="submit" className="btn bg-base-100 text-base-content border-none">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}