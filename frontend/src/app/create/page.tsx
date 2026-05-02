"use client";

import { useMemo, useState } from "react";
import { useClientMounted } from "@/hooks/useClientMounted";
import { errorMessage } from "@/lib/errorMessage";
import toast from "react-hot-toast";
import { isAddress, parseEther, type Address } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { CardShell } from "@/components/ui/card-shell";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { useRootstreamContract, useRootstreamWrite } from "@/hooks/useRootstream";
import { useTxToast } from "@/hooks/useTxToast";

export default function CreatePage() {
  const { isConnected } = useAccount();
  const mounted = useClientMounted();
  const { address: contractAddress, abi } = useRootstreamContract();
  const write = useRootstreamWrite();
  const receipt = useWaitForTransactionReceipt({ hash: write.data });

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.0001");
  const [interval, setInterval] = useState("60");
  const [triedSubmit, setTriedSubmit] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!recipient) e.recipient = "Recipient is required";
    else if (!isAddress(recipient)) e.recipient = "Invalid address";

    const amt = Number(amount);
    if (!amount) e.amount = "Amount is required";
    else if (!Number.isFinite(amt) || amt <= 0) e.amount = "Amount must be > 0";

    const intv = Number(interval);
    if (!interval) e.interval = "Interval is required";
    else if (!Number.isFinite(intv) || intv <= 0) e.interval = "Interval must be > 0";
    return e;
  }, [recipient, amount, interval]);

  useTxToast(write.data, receipt, {
    pending: "Create stream submitted…",
    success: "Stream created",
    reverted: "Transaction reverted.",
    error: "Transaction failed",
  });

  async function submit() {
    setTriedSubmit(true);
    if (!isConnected) return toast.error("Connect your wallet first");
    if (Object.keys(errors).length) return toast.error("Fix the form errors");

    try {
      write.writeContract({
        address: contractAddress,
        abi,
        functionName: "createStream",
        args: [recipient as Address, parseEther(amount), BigInt(interval)],
      });
    } catch (e: unknown) {
      toast.error(errorMessage(e) || "Create stream failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Create Stream</h1>
        <p className="text-sm text-[var(--rs-muted)]">
          Create a prepaid recurring payment stream. Deposit RBTC in Funds first.
        </p>
      </div>

      <div className="max-w-2xl">
        <CardShell title="Stream details" description="RBTC (18 decimals) · interval in seconds">
          <div className="grid gap-4">
            <Field
              label="Recipient address"
              placeholder="0x…"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              error={triedSubmit ? errors.recipient : undefined}
              spellCheck={false}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Amount per interval (RBTC)"
                placeholder="0.0001"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={triedSubmit ? errors.amount : undefined}
              />
              <Field
                label="Interval (seconds)"
                placeholder="60"
                inputMode="numeric"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                error={triedSubmit ? errors.interval : undefined}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={submit} disabled={write.isPending || !mounted || !isConnected}>
                Create stream
              </Button>
            </div>
          </div>
        </CardShell>
      </div>
    </div>
  );
}

