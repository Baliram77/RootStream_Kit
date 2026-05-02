"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#0b0b0b", color: "#fafafa", fontFamily: "system-ui, sans-serif", padding: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>Application error</h1>
        <p style={{ opacity: 0.75, marginTop: 8 }}>{error.message || "A critical error occurred."}</p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: 16,
            padding: "10px 16px",
            borderRadius: 12,
            border: "none",
            background: "#ff6b00",
            color: "#000",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
