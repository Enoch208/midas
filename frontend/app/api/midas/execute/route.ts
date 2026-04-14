import { Contract, JsonRpcProvider, Wallet, formatUnits, parseUnits } from "ethers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const AUDIERA_BASE = "https://ai.audiera.fi"
const AUDIERA_DEFAULT_ARTIST_ID = "i137z0bj0cwsbzrzd8m0c"
const AUDIERA_ARTISTS = [
  { id: "i137z0bj0cwsbzrzd8m0c", name: "Jason Miller" },
  { id: "xa6h1wjowcyvo1r87x1np", name: "Dylan Cross" },
  { id: "woujl3ws7l9z6df4p0y03", name: "Trevor Knox" },
  { id: "yinjs025l733tttxgy2w5", name: "Rhea Monroe" },
  { id: "osipvytdvxuzci9pn2nz1", name: "Kira" },
  { id: "jyjcnj6t3arzzb5dnzk4p", name: "Ray" },
  { id: "lwyap77qryxy4xz8vo11m", name: "Kayden West" },
  { id: "hcqa005jz02ikis7xt2q4", name: "Talia Brooks" },
  { id: "yk5reyqu4ko46k5knx4w9", name: "Sienna Blake" },
  { id: "tzuww7dbsh4enwifaptfl", name: "Briana Rose" },
  { id: "udst8rsngyccqh3e2y80a", name: "Leo Martin" },
  { id: "9j282m4kbg1dukqabas3h", name: "Amelia Clarke" },
] as const
const GENRES = ["Melancholic Lofi", "Dark Drill", "Upbeat Afrobeats"] as const
const KEYS = ["C minor", "G minor", "A minor", "F# minor", "D minor", "E minor", "Bb minor", "C# minor"] as const
const STYLE_MAP: Record<(typeof GENRES)[number], string[]> = {
  "Melancholic Lofi": ["R&B", "Indie"],
  "Dark Drill": ["Hip-Hop"],
  "Upbeat Afrobeats": ["Afrobeat", "Pop"],
}
const BEAT_ABI = ["function approve(address spender, uint256 amount) external returns (bool)"] as const
const SPLITTER_ABI = ["function executeFeatureSplit(address originalCreator, uint256 amount) external"] as const

type MusicResult = {
  status: "completed" | "processing" | "error"
  jobId: string | null
  pollUrl: string | null
  url: string | null
  fileUrl: string | null
  title: string | null
  duration: number | null
  error: string | null
}

type AnalysisResult = {
  bpm: number
  key: string
  durationSec: number
  source: "client" | "vps" | "fallback"
  genreHint?: string | null
}

type ParsedRequest = {
  connectedCreator: string | null
  stemFile: File | null
  stemName: string | null
  stemSize: number | null
  stemType: string | null
  clientAnalysis: AnalysisResult | null
  audieraApiKey: string | null
}

const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]

const randomHex = (length: number) => {
  const chars = "0123456789abcdef"
  let out = ""
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

const randomAddress = () => `0x${randomHex(40)}`

const isValidAddress = (addr: unknown): addr is string =>
  typeof addr === "string" && /^0x[a-fA-F0-9]{40}$/.test(addr)

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function pickArtistFromWallet(wallet: string | null) {
  if (!wallet) {
    return AUDIERA_ARTISTS.find((artist) => artist.id === AUDIERA_DEFAULT_ARTIST_ID) ?? AUDIERA_ARTISTS[0]
  }
  const hex = wallet.startsWith("0x") ? wallet.slice(2) : wallet
  const seed = Number.parseInt(hex.slice(-8), 16)
  const idx = Number.isFinite(seed) ? seed % AUDIERA_ARTISTS.length : 0
  return AUDIERA_ARTISTS[idx]
}

function normalizeClientAnalysis(raw: unknown): AnalysisResult | null {
  if (!raw || typeof raw !== "object") return null
  const o = raw as Record<string, unknown>
  const bpm = Math.round(Number(o.bpm))
  const key = typeof o.key === "string" ? o.key : ""
  const durationSec = Math.round(Number(o.durationSec))
  if (!Number.isFinite(bpm) || !key || !Number.isFinite(durationSec)) return null
  const genreHint = typeof o.genreHint === "string" ? o.genreHint : null
  return { bpm, key, durationSec, source: "client", genreHint }
}

async function parseRequest(request: Request): Promise<ParsedRequest> {
  const contentType = request.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as {
      creator?: string
      audieraApiKey?: string
      analysis?: unknown
      stemMeta?: { name?: string; size?: number; type?: string }
    } | null
    const creator =
      body && isValidAddress(body.creator) ? body.creator : null
    const meta = body?.stemMeta
    return {
      connectedCreator: creator,
      stemFile: null,
      stemName: meta?.name ?? null,
      stemSize: typeof meta?.size === "number" ? meta.size : null,
      stemType: meta?.type ?? null,
      clientAnalysis: normalizeClientAnalysis(body?.analysis),
      audieraApiKey:
        typeof body?.audieraApiKey === "string" && body.audieraApiKey.trim()
          ? body.audieraApiKey.trim()
          : null,
    }
  }

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData()
    const creator = formData.get("creator")
    const stem = formData.get("stem")
    const audieraApiKeyRaw = formData.get("audieraApiKey")
    return {
      connectedCreator: isValidAddress(creator) ? creator : null,
      stemFile: stem instanceof File ? stem : null,
      stemName: stem instanceof File ? stem.name : null,
      stemSize: stem instanceof File ? stem.size : null,
      stemType: stem instanceof File ? stem.type : null,
      clientAnalysis: null,
      audieraApiKey:
        typeof audieraApiKeyRaw === "string" && audieraApiKeyRaw.trim()
          ? audieraApiKeyRaw.trim()
          : null,
    }
  }

  return {
    connectedCreator: null,
    stemFile: null,
    stemName: null,
    stemSize: null,
    stemType: null,
    clientAnalysis: null,
    audieraApiKey: null,
  }
}

async function analyzeTrackOnVps(stemFile: File | null): Promise<AnalysisResult | null> {
  const analysisUrl = process.env.ANALYSIS_API_URL
  if (!analysisUrl || !stemFile) return null

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const form = new FormData()
    form.append("stem", stemFile)
    const headers: Record<string, string> = {}
    if (process.env.ANALYSIS_API_KEY) {
      headers.Authorization = `Bearer ${process.env.ANALYSIS_API_KEY}`
    }
    const response = await fetch(analysisUrl, {
      method: "POST",
      headers,
      body: form,
      signal: controller.signal,
    })
    if (!response.ok) return null

    const payload = (await response.json()) as {
      bpm?: number
      key?: string
      durationSec?: number
      genreHint?: string
    }

    const bpm = Math.round(Number(payload.bpm))
    const key = typeof payload.key === "string" ? payload.key : ""
    const durationSec = Math.round(Number(payload.durationSec))
    if (!Number.isFinite(bpm) || !key || !Number.isFinite(durationSec)) return null

    return {
      bpm,
      key,
      durationSec,
      source: "vps",
      genreHint: payload.genreHint ?? null,
    }
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

async function pollAudieraMusic(taskId: string, key: string): Promise<MusicResult> {
  const pollUrl = `/api/skills/music/${taskId}`
  for (let attempt = 0; attempt < 60; attempt++) {
    const statusRes = await fetch(`${AUDIERA_BASE}${pollUrl}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${key}` },
    })
    const statusJson = (await statusRes.json()) as {
      success?: boolean
      message?: string
      data?: {
        status?: string
        music?: { title?: string; url?: string; fileUrl?: string; duration?: number }
        musics?: Array<{ title?: string; url?: string; fileUrl?: string; duration?: number }>
      }
    }

    if (!statusRes.ok || !statusJson.success) {
      return {
        status: "error",
        jobId: taskId,
        pollUrl,
        url: null,
        fileUrl: null,
        title: null,
        duration: null,
        error: statusJson.message ?? `Audiera music poll failed (${statusRes.status})`,
      }
    }

    const first = statusJson.data?.musics?.[0] ?? statusJson.data?.music
    if (statusJson.data?.status === "completed" && first?.url) {
      return {
        status: "completed",
        jobId: taskId,
        pollUrl,
        url: first.url ?? null,
        fileUrl: first.fileUrl ?? null,
        title: first.title ?? null,
        duration: first.duration ?? null,
        error: null,
      }
    }

    await wait(5000)
  }

  return {
    status: "processing",
    jobId: taskId,
    pollUrl,
    url: null,
    fileUrl: null,
    title: null,
    duration: null,
    error: "Music generation timed out before completion",
  }
}

export async function POST(request: Request) {
  const parsed = await parseRequest(request)
  const {
    connectedCreator,
    stemFile,
    stemName,
    stemSize,
    stemType,
    clientAnalysis,
    audieraApiKey,
  } =
    parsed
  if (!audieraApiKey) {
    return Response.json(
      {
        status: "error",
        message:
          "Missing audieraApiKey. Get one from https://ai.audiera.fi/en/settings/api-keys and include it in your request.",
      },
      { status: 400 },
    )
  }
  const analysis =
    clientAnalysis ?? (await analyzeTrackOnVps(stemFile))
  const genre = pick(GENRES)
  const stemSeed = stemSize ?? Math.floor(Math.random() * 100000)
  const metadata = {
    bpm: analysis?.bpm ?? (70 + (stemSeed % 90)),
    key: analysis?.key ?? pick(KEYS),
    durationSec: analysis?.durationSec ?? (120 + (stemSeed % 120)),
    cid: `bafybe${randomHex(52)}`,
    sourceFileName: stemName,
    sourceFileSize: stemSize,
    sourceFileType: stemType,
    analysisSource: analysis?.source ?? "fallback",
    analysisApiUrl:
      process.env.NEXT_PUBLIC_ANALYSIS_API_URL ??
      process.env.ANALYSIS_API_URL ??
      null,
  }

  const audieraKey = audieraApiKey
  const dynamicArtist = pickArtistFromWallet(connectedCreator)
  const configuredArtistId = process.env.AUDIERA_ARTIST_ID
  const selectedArtist =
    configuredArtistId
      ? AUDIERA_ARTISTS.find((artist) => artist.id === configuredArtistId) ?? {
          id: configuredArtistId,
          name: "Custom Artist",
        }
      : dynamicArtist
  const audieraArtistId = selectedArtist.id
  const inspiration = `A highly technical, punchy 4-bar verse that complements a ${genre} track at ${metadata.bpm} BPM in ${metadata.key}. Stem: ${stemName ?? "unknown-file"}. Return only the 4 lines of lyrics.`

  let lyrics = ""
  let audieraLyricsStatus: "success" | "error" = "error"
  let audieraLyricsError: string | null = null

  try {
    if (!audieraKey) throw new Error("Missing AUDIERA_API_KEY")
    const lyricsRes = await fetch(`${AUDIERA_BASE}/api/skills/lyrics`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${audieraKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inspiration }),
    })
    const lyricsJson = (await lyricsRes.json()) as {
      success?: boolean
      data?: { lyrics?: string }
      message?: string
    }
    if (!lyricsRes.ok || !lyricsJson.success || !lyricsJson.data?.lyrics) {
      throw new Error(lyricsJson.message ?? `Audiera lyrics failed (${lyricsRes.status})`)
    }
    lyrics = lyricsJson.data.lyrics.trim()
    audieraLyricsStatus = "success"
  } catch (err) {
    audieraLyricsError = err instanceof Error ? err.message : String(err)
  }

  let musicResult: MusicResult = {
    status: "error",
    jobId: null,
    pollUrl: null,
    url: null,
    fileUrl: null,
    title: null,
    duration: null,
    error: "Music generation was not started",
  }

  try {
    if (!audieraKey) throw new Error("Missing AUDIERA_API_KEY")
    const musicRes = await fetch(`${AUDIERA_BASE}/api/skills/music`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${audieraKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        styles: STYLE_MAP[genre],
        artistId: audieraArtistId,
        lyrics: lyrics || undefined,
        inspiration: `${inspiration} Generate a full vocal track.`,
      }),
    })
    const musicJson = (await musicRes.json()) as {
      success?: boolean
      message?: string
      data?: { taskId?: string; pollUrl?: string }
    }
    if (!musicRes.ok || !musicJson.success || !musicJson.data?.taskId) {
      throw new Error(musicJson.message ?? `Audiera music failed (${musicRes.status})`)
    }
    musicResult = await pollAudieraMusic(musicJson.data.taskId, audieraKey)
  } catch (err) {
    musicResult = {
      status: "error",
      jobId: null,
      pollUrl: null,
      url: null,
      fileUrl: null,
      title: null,
      duration: null,
      error: err instanceof Error ? err.message : String(err),
    }
  }

  const amountWhole = 100 + Math.floor(Math.random() * 4901)
  const amount = parseUnits(amountWhole.toString(), 18)
  const creatorAddress = connectedCreator ?? randomAddress()
  const rpcUrl = process.env.BSC_RPC_URL ?? process.env.BSC_TESTNET_RPC ?? null
  const privateKey = process.env.MIDAS_AGENT_PRIVATE_KEY ?? process.env.PRIVATE_KEY ?? null
  const beatAddress = process.env.BEAT_TOKEN_CONTRACT ?? process.env.NEXT_PUBLIC_BEAT_TOKEN_CONTRACT ?? null
  const splitterAddress = process.env.SPLITTER_CONTRACT ?? process.env.NEXT_PUBLIC_SPLITTER_CONTRACT ?? null

  let txHash = `0x${randomHex(64)}`
  let onChainStatus: "broadcast" | "fallback" = "fallback"
  let onChainError: string | null = null

  try {
    if (!rpcUrl || !privateKey || !beatAddress || !splitterAddress) {
      throw new Error("Missing Web3 env vars for deployed contracts")
    }
    const provider = new JsonRpcProvider(rpcUrl)
    const wallet = new Wallet(privateKey, provider)
    const beatToken = new Contract(beatAddress, BEAT_ABI, wallet)
    const splitter = new Contract(splitterAddress, SPLITTER_ABI, wallet)
    const approveTx = await beatToken.approve(splitterAddress, amount)
    await approveTx.wait(1)
    const tx = await splitter.executeFeatureSplit(creatorAddress, amount)
    const receipt = await tx.wait(1)
    txHash = receipt?.hash ?? tx.hash
    onChainStatus = "broadcast"
  } catch (err) {
    onChainError = err instanceof Error ? err.message : String(err)
  }

  const creatorAmount = amount / BigInt(2)
  const ownerAmount = amount - creatorAmount

  return Response.json({
    status: "success",
    genre,
    metadata,
    audiera_lyrics_status: audieraLyricsStatus,
    audiera_lyrics_error: audieraLyricsError,
    lyrics,
    audiera_music_status: musicResult.status,
    audiera_music_job_id: musicResult.jobId,
    audiera_music_poll_url: musicResult.pollUrl,
    audiera_music_url: musicResult.url,
    audiera_music_file_url: musicResult.fileUrl,
    audiera_music_title: musicResult.title,
    audiera_music_duration: musicResult.duration,
    audiera_music_error: musicResult.error,
    audiera_artist_id: selectedArtist.id,
    audiera_artist_name: selectedArtist.name,
    txHash,
    bscScanUrl: `https://testnet.bscscan.com/tx/${txHash}`,
    onChain: { status: onChainStatus, error: onChainError },
    contracts: {
      beatToken: beatAddress,
      splitter: splitterAddress,
      rpc: rpcUrl,
    },
    amount: formatUnits(amount, 18),
    amountRaw: amount.toString(),
    splits: {
      originalCreator: creatorAddress,
      creatorAmount: formatUnits(creatorAmount, 18),
      ownerAmount: formatUnits(ownerAmount, 18),
    },
  })
}
