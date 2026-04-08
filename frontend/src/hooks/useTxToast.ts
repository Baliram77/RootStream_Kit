import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import type { Hash } from "viem";

type ReceiptLike = {
  status?: "success" | "reverted";
};

type WaitState = {
  isPending: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  data?: ReceiptLike;
};

/**
 * Small helper to unify tx toasts and avoid fragile per-page dedupe refs.
 * - Shows loading when a new hash appears
 * - Shows success/reverted/error exactly once per hash
 */
export function useTxToast(hash: Hash | undefined, receipt: WaitState, messages: { pending: string; success: string; reverted: string; error: string }) {
  const lastFinalized = useRef<Hash | undefined>(undefined);
  const lastPending = useRef<Hash | undefined>(undefined);

  useEffect(() => {
    if (!hash) return;

    // New tx submitted
    if (lastPending.current !== hash) {
      lastPending.current = hash;
      lastFinalized.current = undefined;
      toast.loading(messages.pending, { id: "tx" });
    }
  }, [hash, messages.pending]);

  useEffect(() => {
    if (!hash) return;
    if (receipt.isPending || receipt.isLoading) return;
    if (lastFinalized.current === hash) return;

    if (receipt.isSuccess) {
      lastFinalized.current = hash;
      if (receipt.data?.status === "reverted") toast.error(messages.reverted, { id: "tx", duration: 8000 });
      else toast.success(messages.success, { id: "tx" });
      return;
    }

    if (receipt.isError) {
      lastFinalized.current = hash;
      toast.error(messages.error, { id: "tx" });
    }
  }, [
    hash,
    receipt.isPending,
    receipt.isLoading,
    receipt.isSuccess,
    receipt.isError,
    receipt.data,
    messages.success,
    messages.reverted,
    messages.error,
  ]);
}

