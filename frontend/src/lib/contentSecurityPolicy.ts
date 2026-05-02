/**
 * CSP for Next.js + RainbowKit / wagmi (WalletConnect).
 * Env URLs are merged into connect-src; wallet traffic uses https:/wss: to provider hosts.
 */
export function buildContentSecurityPolicy(): string {
  const rpc = process.env.NEXT_PUBLIC_RPC_URL?.trim();
  const envio = process.env.NEXT_PUBLIC_ENVIO_GRAPHQL_URL?.trim();

  const connectParts = [
    "'self'",
    "https://*.walletconnect.com",
    "wss://*.walletconnect.com",
    "https://*.walletconnect.org",
    "wss://*.walletconnect.org",
    "https://relay.walletconnect.com",
    "wss://relay.walletconnect.com",
    "https://pulse.walletconnect.org",
    "https://rpc.walletconnect.com",
    "https://api.web3modal.org",
    "https://explorer.walletconnect.com",
    "https://cca-lite.coinbase.com",
    "https://*.rsk.co",
    "wss://*.rsk.co",
    "https://public-node.testnet.rsk.co",
    "https://public-node.rsk.co",
  ];
  if (rpc) connectParts.push(rpc);
  if (envio) connectParts.push(envio);

  const connectSrc = connectParts.join(" ");

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    `connect-src ${connectSrc}`,
  ].join("; ");
}
