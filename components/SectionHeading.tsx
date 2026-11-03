interface SectionHeadingProps {
  title: string;
  subtitle: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl opacity-70">{subtitle}</p>
    </div>
  );
}