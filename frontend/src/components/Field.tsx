"use client";

import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  hint,
  error,
  right,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  right?: ReactNode;
}) {
  const baseId = useId();
  const errorId = `${baseId}-error`;
  const hintId = `${baseId}-hint`;

  return (
    <label className="block">
      <div className="flex items-end justify-between gap-3">
        <span className="text-sm font-medium text-white">{label}</span>
        {right}
      </div>
      <input
        {...props}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={[
          "mt-2 w-full rounded-xl bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-white ring-1 outline-none",
          error
            ? "ring-[rgba(239,68,68,0.55)] focus-visible:ring-[rgba(239,68,68,0.8)]"
            : "ring-[var(--rs-border)] focus-visible:ring-[rgba(255,107,0,0.35)]",
          "placeholder:text-[var(--rs-muted)]",
          props.className ?? "",
        ].join(" ")}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-2 text-sm text-[var(--rs-muted)]">
          {hint}
        </p>
      ) : null}
    </label>
  );
}
