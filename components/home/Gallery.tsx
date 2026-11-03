import SectionHeading from "@/components/SectionHeading";
import { GALLERY } from "@/lib/gallery";

export default function Gallery() {
  return (
    <section className="bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          title="Moments from the Community"
          subtitle="A glimpse of the good that happens when neighbours come together."
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {GALLERY.map((item) => (
            <div
              key={item.src}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
            >
              <img
                src={item.src}
                alt={item.caption}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/60 p-3 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">
                {item.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}