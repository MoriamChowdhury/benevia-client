import SectionHeading from "@/components/SectionHeading";

const features = [
  {
    icon: "📝",
    title: "Create Events",
    text: "Plan a cleanup, plantation or donation drive in minutes and share it with your whole community.",
  },
  {
    icon: "🤝",
    title: "Join with One Click",
    text: "Found an event you care about? Join instantly and show up where help is needed most.",
  },
  {
    icon: "📍",
    title: "Find Events Nearby",
    text: "Browse upcoming events by type or search by title to find one close to your neighbourhood.",
  },
  {
    icon: "🔒",
    title: "Safe and Secure",
    text: "Your account is protected with secure login, and only you can edit or delete your own events.",
  },
];

export default function Features() {
  return (
    <section className="bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          title="Why Benevia"
          subtitle="Everything you need to organize and join social service events in one place."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="card h-full bg-base-100 shadow-md">
              <div className="card-body items-center text-center">
                <div className="text-5xl">{feature.icon}</div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="opacity-80">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}