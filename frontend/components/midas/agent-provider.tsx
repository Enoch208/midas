"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";

export type PipelinePhase =
  | "idle"
  | "analyzing"
  | "synthesizing"
  | "settling"
  | "confirmed";

export type LiveTx = {
  hash: string;
  track: string;
  artist: string;
  to: string;
  amount: string;
  ago: string;
  fresh?: boolean;
};

export type PipelineResult = {
  genre: string;
  bpm: number;
  keyName: string;
  durationSec: number;
  lyrics: string[];
  audieraLyricsStatus: "success" | "error";
  audieraMusicStatus: "completed" | "processing" | "error";
  audieraMusicJobId: string | null;
  audieraMusicPollUrl: string | null;
  audieraMusicUrl: string | null;
  audieraMusicFileUrl: string | null;
  audieraMusicError: string | null;
  audieraArtistId: string | null;
  audieraArtistName: string | null;
  amountFull: string;
  amountCreator: string;
  txHash: string;
  bscScanUrl: string;
  creatorWallet: string;
  beatTokenContract: string | null;
  splitterContract: string | null;
};

type Ctx = {
  phase: PipelinePhase;
  result: PipelineResult | null;
  liveSplits: LiveTx[];
  wallet: string | null;
  walletConnecting: boolean;
  walletError: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  runMidasAgent: (file: File | null) => Promise<void>;
};

const AgentContext = createContext<Ctx | null>(null);

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent used outside <AgentProvider>");
  return ctx;
}

const SEED_SPLITS: LiveTx[] = [
  { hash: "0x9f4a1c…2e8b7d3a", track: "Crystal Static",  artist: "@rune.eth",     to: "0x7a9f…2e8b", amount: "12,480.00", ago: "2s"  },
  { hash: "0x3b71ef…4c9a0f12", track: "Sable Corridor",  artist: "@halcyon",      to: "0x44c1…9d7e", amount:  "8,312.50", ago: "5s"  },
  { hash: "0xae28c0…71f3b4d9", track: "Midnight Signal", artist: "@o.p.n",        to: "0xbb02…31ac", amount:  "4,962.17", ago: "11s" },
  { hash: "0x5c18fa…8d0e2b4c", track: "Brass Ledger",    artist: "@mercer",       to: "0xc2a1…ee88", amount: "21,004.00", ago: "19s" },
  { hash: "0x7e4b02…9ac1f308", track: "Obsidian Bloom",  artist: "@null.route",   to: "0xf17d…4a21", amount:  "3,748.82", ago: "24s" },
  { hash: "0x1d0fac…e8b72199", track: "Vault Index",     artist: "@sable",        to: "0x09ee…77b3", amount: "15,610.40", ago: "33s" },
  { hash: "0x44c9a1…07e3f22a", track: "Gold Reserve",    artist: "@atrium",       to: "0xde3f…0c41", amount:  "9,220.05", ago: "41s" },
  { hash: "0xba81c4…512d0efa", track: "Kinetic Kiln",    artist: "@flint",        to: "0x8a0b…23f7", amount:  "6,480.66", ago: "47s" },
  { hash: "0x2f07d1…34aecb90", track: "Low Earth Orbit", artist: "@lens",         to: "0x61cc…b402", amount: "11,128.00", ago: "55s" },
  { hash: "0x8819ff…b0327c5d", track: "Feature Yield",   artist: "@vox.eth",      to: "0x33b8…50d2", amount:  "7,902.11", ago: "1m"  },
  { hash: "0x063ea2…d71b8e46", track: "Ore Machine",     artist: "@copperhead",   to: "0x99a4…124c", amount: "18,265.74", ago: "1m"  },
  { hash: "0xfe47c0…9b12340a", track: "Participation",   artist: "@midas",        to: "0x01df…86e9", amount:  "5,540.30", ago: "1m"  },
];

function short(addr: string | undefined | null, head = 6, tail = 4) {
  if (!addr) return "0x…";
  if (addr.length <= head + tail + 1) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

function formatBeat(raw: string | undefined | null) {
  if (!raw) return "0.00";
  const n = Number(raw);
  if (!Number.isFinite(n)) return raw;
  return n.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function AgentProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<PipelinePhase>("idle");
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [liveSplits, setLiveSplits] = useState<LiveTx[]>(SEED_SPLITS);
  const [walletError, setWalletError] = useState<string | null>(null);
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { address, isConnected, status } = useAppKitAccount({ namespace: "eip155" });
  const runningRef = useRef(false);
  const wallet = isConnected && address ? address : null;
  const walletConnecting = status === "connecting" || status === "reconnecting";

  const connectWallet = useCallback(async () => {
    setWalletError(null);
    if (
      (!process.env.NEXT_PUBLIC_REOWN_PROJECT_ID &&
        !process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) ||
      process.env.NEXT_PUBLIC_REOWN_PROJECT_ID === "REOWN_PROJECT_ID_REQUIRED"
    ) {
      setWalletError(
        "Missing NEXT_PUBLIC_REOWN_PROJECT_ID or NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in frontend .env",
      );
      return;
    }
    try {
      await open({ view: "Connect" });
    } catch (err) {
      setWalletError(err instanceof Error ? err.message : "Wallet connection failed");
    }
  }, [open]);

  const disconnectWallet = useCallback(async () => {
    await disconnect();
  }, [disconnect]);

  const runMidasAgent = useCallback(async (file: File | null) => {
    if (!wallet || !file) return;
    if (runningRef.current) return;
    runningRef.current = true;

    setPhase("analyzing");
    setResult(null);

    try {
      const analyzeDelay = wait(1400);
      const body = new FormData();
      body.append("creator", wallet);
      body.append("stem", file);
      const res = await fetch("/api/midas/execute", {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error(`execute failed: ${res.status}`);
      const data = await res.json();

      await analyzeDelay;

      const lyricsRaw: string = data.lyrics ?? "";
      const lyricLines = lyricsRaw
        .split("\n")
        .map((l: string) => l.trim())
        .filter(Boolean);

      const txHash: string = data.txHash ?? "0x";
      const creator: string = data?.splits?.originalCreator ?? wallet ?? "";
      const creatorAmount: string = data?.splits?.creatorAmount ?? "0";
      const fullAmount: string = data?.amount ?? "0";

      const payload: PipelineResult = {
        genre: data.genre ?? "Untitled",
        bpm: data.metadata?.bpm ?? 0,
        keyName: data.metadata?.key ?? "—",
        durationSec: data.metadata?.durationSec ?? 0,
        lyrics: lyricLines,
        audieraLyricsStatus:
          data.audiera_lyrics_status === "success" ? "success" : "error",
        audieraMusicStatus:
          data.audiera_music_status === "completed"
            ? "completed"
            : data.audiera_music_status === "processing"
            ? "processing"
            : "error",
        audieraMusicJobId: data.audiera_music_job_id ?? null,
        audieraMusicPollUrl: data.audiera_music_poll_url ?? null,
        audieraMusicUrl: data.audiera_music_url ?? null,
        audieraMusicFileUrl: data.audiera_music_file_url ?? null,
        audieraMusicError: data.audiera_music_error ?? null,
        audieraArtistId: data.audiera_artist_id ?? null,
        audieraArtistName: data.audiera_artist_name ?? null,
        amountFull: fullAmount,
        amountCreator: creatorAmount,
        txHash,
        bscScanUrl: data.bscScanUrl ?? `https://testnet.bscscan.com/tx/${txHash}`,
        creatorWallet: creator,
        beatTokenContract: data.contracts?.beatToken ?? null,
        splitterContract: data.contracts?.splitter ?? null,
      };

      setResult(payload);
      setPhase("synthesizing");

      const lyricDwell =
        Math.max(1, lyricLines.length) * 650 + 400;
      await wait(lyricDwell);

      setPhase("settling");
      await wait(1800);

      setPhase("confirmed");

      const newTx: LiveTx = {
        hash: short(txHash, 8, 8),
        track: `Midas · ${payload.genre}`,
        artist: wallet ? short(wallet) : "@midas.agent",
        to: short(creator, 6, 4),
        amount: formatBeat(creatorAmount || fullAmount),
        ago: "now",
        fresh: true,
      };
      setLiveSplits((prev) => [newTx, ...prev]);
      setTimeout(() => {
        setLiveSplits((prev) =>
          prev.map((tx) =>
            tx.hash === newTx.hash ? { ...tx, fresh: false } : tx,
          ),
        );
      }, 2200);
    } catch (err) {
      console.error("[midas] pipeline error", err);
      setPhase("idle");
    } finally {
      runningRef.current = false;
    }
  }, [wallet]);

  return (
    <AgentContext.Provider
      value={{
        phase,
        result,
        liveSplits,
        wallet,
        walletConnecting,
        walletError,
        connectWallet,
        disconnectWallet,
        runMidasAgent,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}
