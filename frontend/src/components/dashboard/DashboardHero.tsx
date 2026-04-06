/**
 * Static marketing strip for the home dashboard (no data / wallet logic).
 */
export function DashboardHero() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[var(--rs-border)] bg-[linear-gradient(145deg,rgba(255,107,0,0.08),rgba(17,17,17,0.95))] px-5 py-6 sm:px-8 sm:py-8"
      aria-labelledby="dashboard-hero-heading"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--rs-orange)] opacity-[0.07] blur-3xl" />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rs-orange)]">Rootstream kit</p>
      <h2
        id="dashboard-hero-heading"
        className="mt-2 max-w-2xl text-xl font-semibold tracking-tight text-white sm:text-2xl"
      >
        Recurring native-token streams, simplified
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--rs-muted)]">
        Fund a prepaid balance, create streams, and let automation or anyone execute due payments on Rootstock
        testnet—all from one dashboard.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-3 py-1 text-xs text-[var(--rs-muted)] ring-1 ring-[var(--rs-border)]">
          Rootstock testnet
        </span>
        <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-3 py-1 text-xs text-[var(--rs-muted)] ring-1 ring-[var(--rs-border)]">
          Prepaid RBTC
        </span>
        <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-3 py-1 text-xs text-[var(--rs-muted)] ring-1 ring-[var(--rs-border)]">
          Envio + on-chain data
        </span>
      </div>
    </section>
  );
}
