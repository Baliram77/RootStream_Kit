/**
 * Fetch with a hard timeout so Apollo does not hang forever if GraphQL is unreachable
 * (common when the browser cannot reach WSL-only localhost, or Envio is stopped).
 */
export function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit, timeoutMs = 60000): Promise<Response> {
  const controller = new AbortController();
  const timeoutReason = new DOMException(
    `Envio GraphQL request exceeded ${timeoutMs / 1000}s`,
    "TimeoutError",
  );
  const t = setTimeout(() => controller.abort(timeoutReason), timeoutMs);
  const parent = init?.signal;
  if (parent) {
    if (parent.aborted) controller.abort();
    else
      parent.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
  }

  const wslHint =
    "If Next.js runs in WSL but you open the site in Windows, 127.0.0.1 is your PC — not WSL. In WSL run: hostname -I (first IP) and set NEXT_PUBLIC_ENVIO_GRAPHQL_URL=http://THAT_IP:8080/v1/graphql then restart next dev.";

  return fetch(input, { ...init, signal: controller.signal })
    .finally(() => clearTimeout(t))
    .catch((err: unknown) => {
      const name =
        err && typeof err === "object" && "name" in err ? String((err as { name: unknown }).name) : "";
      const msg =
        err && typeof err === "object" && "message" in err ? String((err as { message: unknown }).message) : "";

      if (name === "AbortError" || msg.toLowerCase().includes("abort")) {
        throw new Error(
          `Cannot reach Envio GraphQL (timed out or aborted after ${timeoutMs / 1000}s). ${wslHint}`,
        );
      }
      throw err;
    });
}
