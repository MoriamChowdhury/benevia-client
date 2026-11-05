export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
    
      aria-label="Benevia"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-extrabold text-primary-content ${className}`}
    >
      <span className="text-xl leading-none">B</span>
      <span className="text-sm leading-none opacity-80">v</span>
    </span>
  );
}