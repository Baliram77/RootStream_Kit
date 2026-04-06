"use client";

import { useEffect, useMemo, useState } from "react";
import { useClientMounted } from "@/hooks/useClientMounted";
import { useAccount } from "wagmi";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useUserStreamsOnChain } from "@/hooks/useUserStreamsOnChain";
import { formatRbtc, secondsToHuman, shortAddr } from "@/services/format";

export default function StreamsPage() {
  const { isConnected } = useAccount();
  const mounted = useClientMounted();
  const { streams, isLoading } = useUserStreamsOnChain();

  const active = useMemo(() => streams.filter((s) => s.active), [streams]);

  const [nowSec, setNowSec] = useState(0);
  useEffect(() => {
    const tick = () => setNowSec(Math.floor(Date.now() / 1000));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  function nextExec(lastExecuted: bigint, interval: bigint) {
    const t = Number(lastExecuted + interval);
    if (!Number.isFinite(t)) return "-";
    const diff = t - nowSec;
    if (diff <= 0) return "Due now";
    if (diff < 60) return `in ${diff}s`;
    if (diff < 3600) return `in ${Math.round(diff / 60)}m`;
    if (diff < 86400) return `in ${Math.round(diff / 3600)}h`;
    return `in ${Math.round(diff / 86400)}d`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Streams</h1>
        <p className="text-sm text-[var(--rs-muted)]">Your streams (live RPC).</p>
      </div>

      <Card title="Summary" description="Contract reads">
        {!mounted ? (
          <p className="text-sm text-[var(--rs-muted)]">Loading wallet…</p>
        ) : !isConnected ? (
          <p className="text-sm text-[var(--rs-muted)]">Connect your wallet.</p>
        ) : isLoading ? (
          <p className="text-sm text-[var(--rs-muted)]">Loading…</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-[var(--rs-border)] bg-[rgba(255,255,255,0.03)] p-4">
              <div className="text-[var(--rs-muted)]">Total</div>
              <div className="mt-1 text-lg font-semibold text-white">{streams.length}</div>
            </div>
            <div className="rounded-xl border border-[var(--rs-border)] bg-[rgba(255,255,255,0.03)] p-4">
              <div className="text-[var(--rs-muted)]">Active</div>
              <div className="mt-1 text-lg font-semibold text-white">{active.length}</div>
            </div>
          </div>
        )}
      </Card>

      <Card title="All streams" description="Recipient · Amount · Interval · Status">
        {!mounted ? (
          <p className="text-sm text-[var(--rs-muted)]">Loading wallet…</p>
        ) : !isConnected ? (
          <p className="text-sm text-[var(--rs-muted)]">Connect your wallet.</p>
        ) : isLoading ? (
          <p className="text-sm text-[var(--rs-muted)]">Loading…</p>
        ) : streams.length === 0 ? (
          <p className="text-sm text-[var(--rs-muted)]">No streams created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-[var(--rs-muted)]">
                <tr className="border-b border-[var(--rs-border)]">
                  <th className="py-3">ID</th>
                  <th className="py-3">Recipient</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Interval</th>
                  <th className="py-3">Next</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {streams.map((s) => (
                  <tr key={s.streamId.toString()} className="border-b border-[rgba(255,255,255,0.06)]">
                    <td className="py-3 font-medium text-white">{s.streamId.toString()}</td>
                    <td className="py-3 text-white">{shortAddr(s.recipient)}</td>
                    <td className="py-3 text-white">{formatRbtc(s.amountPerInterval)}</td>
                    <td className="py-3 text-white">{secondsToHuman(s.interval)}</td>
                    <td className="py-3 text-white">{nextExec(s.lastExecuted, s.interval)}</td>
                    <td className="py-3">
                      <Badge tone={s.active ? "active" : "cancelled"}>
                        {s.active ? "Active" : "Cancelled"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

