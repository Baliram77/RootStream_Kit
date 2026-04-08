import { createConfig, http } from "wagmi";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";
import { getRootstockTestnetChain } from "@/services/chains";
import { getPublicEnv } from "@/services/env";

export function getWagmiConfig() {
  const { rpcUrl, walletConnectProjectId } = getPublicEnv();
  const rootstockTestnet = getRootstockTestnetChain();
  return createConfig({
    chains: [rootstockTestnet],
    connectors: [
      injected(),
      ...(walletConnectProjectId ? [walletConnect({ projectId: walletConnectProjectId })] : []),
      coinbaseWallet({ appName: "Rootstream Kit" }),
    ],
    transports: {
      [rootstockTestnet.id]: http(rpcUrl),
    },
  });
}

