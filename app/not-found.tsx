import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-20 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-300">404</p>
        <h1 className="mt-4 text-5xl font-black">This story moved off the wire.</h1>
        <p className="mx-auto mt-4 max-w-xl text-white/55">The article or page you requested is unavailable. Return to the newsroom for the latest coverage.</p>
        <Link href="/blog" className="mt-8 inline-block rounded bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-black hover:bg-emerald-300">
          Browse articles
        </Link>
      </div>
    </main>
  );
}
