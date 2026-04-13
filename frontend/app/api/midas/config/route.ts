import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const analysisUploadUrl =
    process.env.ANALYSIS_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_ANALYSIS_API_URL?.trim() ||
    null
  return NextResponse.json(
    { analysisUploadUrl },
    { headers: { "Cache-Control": "no-store" } },
  )
}
