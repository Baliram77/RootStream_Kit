import { defineChain } from "viem";
import { getPublicEnv } from "@/services/env";

export function getRootstockTestnetChain() {
  const { rpcUrl } = getPublicEnv();
  return defineChain({
  id: 31,
  name: "Rootstock Testnet",
  nativeCurrency: { name: "tRBTC", symbol: "tRBTC", decimals: 18 },
  rpcUrls: {
    default: { http: [rpcUrl] },
    public: { http: [rpcUrl] },
  },
  blockExplorers: {
    default: { name: "Rootstock Explorer", url: "https://explorer.testnet.rootstock.io" },
  },
  });
}

