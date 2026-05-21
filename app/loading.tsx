export default function Loading() {
  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-72 animate-pulse rounded border border-white/10 bg-white/[0.05]" />
      ))}
    </main>
  );
}
