import { useMemo } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import type { Address } from "viem";
import { getPublicEnv } from "@/services/env";
import { ROOTSTREAM_ABI } from "@/services/rootstreamAbi";

const ROOTSTREAM_PUBLIC = getPublicEnv();
const ROOTSTREAM_CONTRACT_ADDRESS = ROOTSTREAM_PUBLIC.rootstreamAddress as Address;

export function useRootstreamContract() {
  return useMemo(() => ({ address: ROOTSTREAM_CONTRACT_ADDRESS, abi: ROOTSTREAM_ABI }), []);
}

export function useBalance() {
  const { address } = useAccount();
  const c = useRootstreamContract();
  return useReadContract({
    ...c,
    functionName: "balances",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });
}

export function useActiveStreamCount() {
  const { address } = useAccount();
  const c = useRootstreamContract();
  return useReadContract({
    ...c,
    functionName: "activeStreamCount",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });
}

export function useRootstreamWrite() {
  return useWriteContract();
}
