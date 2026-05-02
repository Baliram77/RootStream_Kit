import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16">
      <h1 className="text-xl font-semibold text-white">Page not found</h1>
      <p className="text-sm text-[var(--rs-muted)]">The page you requested does not exist.</p>
      <div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-[var(--rs-orange)] px-3 py-2 text-sm font-medium text-black transition hover:opacity-95"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
