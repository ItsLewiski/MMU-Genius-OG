import { NextResponse } from "next/server"

export async function GET() {
  // Check if API key exists without exposing it
  const hasApiKey = !!process.env.GOOGLE_API_KEY

  if (!hasApiKey) {
    return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
