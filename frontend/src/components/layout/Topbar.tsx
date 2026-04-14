"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { IconMenu } from "@/components/ui/Icons";

export function Topbar({ onMenu }: { onMenu?: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--rs-border)] bg-[rgba(11,11,11,0.72)] backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(255,255,255,0.06)] text-white ring-1 ring-[var(--rs-border)] hover:bg-[rgba(255,255,255,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rs-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--rs-bg)]"
            onClick={onMenu}
            aria-label="Open menu"
          >
            <IconMenu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <BrandLogo size="sm" withLink />
            <span className="text-sm font-semibold text-white">Rootstream_kit</span>
          </div>
        </div>
        <ConnectButton showBalance={false} />
      </div>
    </header>
  );
}

