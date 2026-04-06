export function errorMessage(e: unknown): string {
  if (e && typeof e === "object" && "shortMessage" in e) {
    const m = (e as { shortMessage?: unknown }).shortMessage;
    if (typeof m === "string" && m) return m;
  }
  if (e instanceof Error) return e.message;
  return String(e);
}
