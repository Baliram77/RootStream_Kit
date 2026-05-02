"use client";

import toast from "react-hot-toast";
import { useEffect, useMemo } from "react";
import { parseEther } from "viem";
import { Button } from "@/components/Button";
import { CardShell } from "@/components/ui/card-shell";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { StatCard } from "@/components/dashboard/StatCard";
import { IconClock, IconGrid, IconWallet } from "@/components/ui/Icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useAnalyticsApollo, useUserStreamsApollo, type EnvioStreamRow } from "@/hooks/useEnvioApollo";
import { useClientMounted } from "@/hooks/useClientMounted";
import { errorMessage } from "@/lib/errorMessage";
import { useUserStreamsOnChain } from "@/hooks/useUserStreamsOnChain";
import { useChainPaymentLogs } from "@/hooks/useChainPaymentLogs";
import { useActiveStreamCount, useBalance, useRootstreamContract, useRootstreamWrite } from "@/hooks/useRootstream";
import { formatRbtc, secondsToHuman, shortAddr } from "@/services/format";
import Link from "next/link";
import { getPublicEnv } from "@/services/env";
import { useTxToast } from "@/hooks/useTxToast";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const addrLower = address?.toLowerCase();
  const mounted = useClientMounted();

  const analytics = useAnalyticsApollo();
  const envioStreams = useUserStreamsApollo(addrLower);

  const { streams: chainStreams, isLoading: chainStreamsLoading, refetch: refetchChainStreams } =
    useUserStreamsOnChain();

  const { data: chainPayLogs = [], refetch: refetchChainPayLogs } = useChainPaymentLogs();

  const chainPaidByStream = useMemo(() => {
    const m = new Map<string, bigint>();
    for (const log of chainPayLogs) {
      const k = log.streamId.toString();
      m.set(k, (m.get(k) ?? 0n) + log.amount);
    }
    return m;
  }, [chainPayLogs]);

  const balance = useBalance();
  const activeCount = useActiveStreamCount();

  const { address: contractAddress, abi } = useRootstreamContract();
  const write = useRootstreamWrite();
  const receipt = useWaitForTransactionReceipt({ hash: write.data });

  useTxToast(write.data, receipt, {
    pending: "Transaction submitted…",
    success: "Transaction confirmed",
    reverted: "Transaction reverted. For Execute: wait until interval passes and keep enough prepaid balance.",
    error: "Transaction failed",
  });

  useEffect(() => {
    const hash = write.data;
    if (!hash || receipt.isPending || receipt.isLoading) return;
    if (receipt.isSuccess || receipt.isError) {
      void refetchChainStreams();
      void refetchChainPayLogs();
      balance.refetch();
      activeCount.refetch();
      void analytics.refetch();
      void envioStreams.refetch();
    }
  }, [
    write.data,
    receipt.isPending,
    receipt.isLoading,
    receipt.isSuccess,
    receipt.isError,
    refetchChainStreams,
    refetchChainPayLogs,
    balance,
    activeCount,
    analytics,
    envioStreams,
  ]);

  async function depositDemo() {
    if (!address) return;
    try {
      write.writeContract({
        address: contractAddress,
        abi,
        functionName: "depositFunds",
        value: parseEther("0.0001"),
      });
    } catch (e: unknown) {
      toast.error(errorMessage(e) || "Deposit failed");
    }
  }

  async function cancelStream(streamId: bigint) {
    try {
      write.writeContract({ address: contractAddress, abi, functionName: "cancelStream", args: [streamId] });
    } catch (e: unknown) {
      toast.error(errorMessage(e) || "Cancel failed");
    }
  }

  async function executePayment(streamId: bigint) {
    try {
      write.writeContract({ address: contractAddress, abi, functionName: "executePayment", args: [streamId] });
    } catch (e: unknown) {
      toast.error(errorMessage(e) || "Execute failed");
    }
  }

  const streams = chainStreams;
  const activeOnChain = streams.filter((s) => s.active);

  const envioByStreamId = new Map<string, EnvioStreamRow>();
  for (const s of envioStreams.data?.Stream ?? []) envioByStreamId.set(String(s.streamId), s);

  const totalPaid = analytics.data?.Analytics_by_pk?.totalPaid;
  const analyticsLoading = analytics.loading && !analytics.error;
  const { envioGraphqlUrl } = getPublicEnv();

  return (
    <div className="space-y-6">
      <DashboardHero />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-[var(--rs-muted)]">
            Streams/balances are live RPC. Analytics/Envio fields can lag; Paid merges Envio + RPC logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              void analytics.refetch();
              void envioStreams.refetch();
              void refetchChainStreams();
              void refetchChainPayLogs();
            }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {analytics.error ? (
        <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <div className="font-semibold text-amber-50">Envio GraphQL unavailable</div>
          <p className="mt-1 text-amber-100/85">{analytics.error.message}</p>
          <p className="mt-2 text-xs text-amber-100/70">
            Expected URL: <span className="font-mono">{envioGraphqlUrl}</span>. Run{" "}
            <span className="font-mono">pnpm dev</span> in <span className="font-mono">envio/</span>. If the site
            opens in Windows but Envio runs in WSL, the browser must reach that host (often use your WSL IP or port
            forwarding instead of <span className="font-mono">127.0.0.1</span>).
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          icon={<IconGrid className="h-5 w-5" />}
          title="Total Streams"
          loading={analyticsLoading}
          value={analytics.data?.Analytics_by_pk?.totalStreams ?? "—"}
          footer="Envio indexed total"
        />
        <StatCard
          icon={<IconClock className="h-5 w-5" />}
          title="Active Streams"
          loading={analyticsLoading}
          value={analytics.data?.Analytics_by_pk?.activeStreams ?? "—"}
          footer="Envio indexed active"
        />
        <StatCard
          icon={<IconWallet className="h-5 w-5" />}
          title="Total Paid"
          loading={analyticsLoading}
          value={totalPaid == null ? "—" : formatRbtc(BigInt(totalPaid))}
          footer="Envio indexed paid"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <CardShell title="Your funds" description="Onchain prepaid balance (contract)">
          {!mounted ? (
            <p className="text-sm text-[var(--rs-muted)]">Loading wallet…</p>
          ) : !isConnected ? (
            <p className="text-sm text-[var(--rs-muted)]">Connect your wallet.</p>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-[var(--rs-muted)]">Balance</div>
                <div className="text-lg font-semibold text-white">
                  {balance.isLoading ? "…" : formatRbtc((balance.data as bigint | undefined) ?? 0n)}
                </div>
                <div className="mt-1 text-xs text-[var(--rs-muted)]">
                  Active streams: {activeCount.isLoading ? "…" : String((activeCount.data as bigint | undefined) ?? 0n)}
                </div>
              </div>
              <Button onClick={depositDemo} disabled={!address || write.isPending}>
                Deposit 0.0001
              </Button>
            </div>
          )}
        </CardShell>

        <CardShell title="Your streams" description="Contract (immediate)">
          {!mounted ? (
            <p className="text-sm text-[var(--rs-muted)]">Loading wallet…</p>
          ) : !isConnected ? (
            <p className="text-sm text-[var(--rs-muted)]">Connect your wallet.</p>
          ) : chainStreamsLoading ? (
            <p className="text-sm text-[var(--rs-muted)]">Loading…</p>
          ) : (
            <div className="text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--rs-muted)]">Active</span>
                <span className="font-semibold text-white">{activeOnChain.length}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[var(--rs-muted)]">Total</span>
                <span className="font-semibold text-white">{streams.length}</span>
              </div>
            </div>
          )}
        </CardShell>

        <CardShell title="Address" description="Connected wallet">
          <div className="text-sm font-mono text-white">
            {!mounted ? "—" : isConnected ? shortAddr(address) : "—"}
          </div>
        </CardShell>
      </div>

      <CardShell
        title="Manage streams"
        description="Live from contract · Paid merges Envio + RPC logs (lookback window)"
      >
        {!mounted ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !isConnected ? (
          <p className="text-sm text-[var(--rs-muted)]">Connect your wallet.</p>
        ) : chainStreamsLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : streams.length === 0 ? (
          <EmptyState
            title="No streams created yet"
            description="Create your first stream to start recurring payments."
            action={
              <Link
                href="/create"
                className="inline-flex rounded-xl bg-[var(--rs-orange)] px-4 py-2 text-sm font-semibold text-black rs-glow"
              >
                Create Stream
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Manage your streams</caption>
              <thead className="sticky top-0 bg-[rgba(11,11,11,0.9)] text-xs text-[var(--rs-muted)]">
                <tr className="border-b border-[var(--rs-border)]">
                  <th scope="col" className="py-3">ID</th>
                  <th scope="col" className="py-3">Recipient</th>
                  <th scope="col" className="py-3">Amount/interval</th>
                  <th scope="col" className="py-3">Interval</th>
                  <th scope="col" className="py-3">Active</th>
                  <th scope="col" className="py-3">Paid</th>
                  <th scope="col" className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {streams.map((s) => {
                  const idKey = s.streamId.toString();
                  const envio = envioByStreamId.get(idKey);
                  const envioPaid = envio?.totalPaid != null ? BigInt(envio.totalPaid as string) : 0n;
                  const rpcPaid = chainPaidByStream.get(idKey) ?? 0n;
                  const paid = rpcPaid > envioPaid ? rpcPaid : envioPaid;
                  return (
                    <tr
                      key={idKey}
                      className="border-b border-[rgba(255,255,255,0.06)] transition hover:bg-[rgba(255,255,255,0.03)]"
                    >
                      <td className="py-3 font-medium text-white">{idKey}</td>
                      <td className="py-3 text-white">{shortAddr(s.recipient)}</td>
                      <td className="py-3 text-white">{formatRbtc(s.amountPerInterval)}</td>
                      <td className="py-3 text-white">{secondsToHuman(s.interval)}</td>
                      <td className="py-3 text-white">{s.active ? "Active" : "Cancelled"}</td>
                      <td className="py-3 text-white">{paid > 0n ? formatRbtc(paid) : "—"}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => executePayment(s.streamId)}
                            disabled={write.isPending || !s.active}
                          >
                            Execute
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => cancelStream(s.streamId)}
                            disabled={write.isPending || !s.active}
                          >
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardShell>
    </div>
  );
}

