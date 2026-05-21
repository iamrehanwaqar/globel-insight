import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-20 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-red-300">Access denied</p>
        <h1 className="mt-4 text-5xl font-black">Admin role required.</h1>
        <p className="mx-auto mt-4 max-w-xl text-white/55">
          You are signed in, but this area is reserved for Global Insight administrators.
        </p>
        <Link href="/" className="mt-8 inline-block rounded bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-black hover:bg-emerald-300">
          Return home
        </Link>
      </div>
    </main>
  );
}
