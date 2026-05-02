"use client";

type Props = { className?: string };

export function IconGrid({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Distinct from {@link IconStreams} — used for dashboard / summary affordances. */
export function IconDashboard({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M4 13h6V4H4v9Zm10 0h6V4h-6v9ZM4 20h6v-5H4v5Zm10 0h6v-5h-6v5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Distinct from {@link IconDashboard} — list affordance for stream listings. */
export function IconStreams({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconPlus({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconClock({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 7v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconWallet({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M4 7.5A3.5 3.5 0 0 1 7.5 4H18a2 2 0 0 1 2 2v2.5M4 7.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7H16a3 3 0 1 1 0-6h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconMenu({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

