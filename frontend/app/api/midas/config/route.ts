import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const baseUrl =
    process.env.ANALYSIS_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_ANALYSIS_API_URL?.trim() ||
    null
  // Make sure to append /analyze if baseUrl is present and not already ending with /analyze
  const analysisUploadUrl = baseUrl
    ? baseUrl.endsWith("/analyze")
      ? baseUrl
      : baseUrl.replace(/\/+$/, "") + "/analyze"
    : null

  return NextResponse.json(
    { analysisUploadUrl },
    { headers: { "Cache-Control": "no-store" } },
  )
}
