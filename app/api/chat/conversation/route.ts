import { type NextRequest, NextResponse } from "next/server"
import { createConversation } from "@/lib/gptbots"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    console.log("[v0] API route - Creating conversation for userId:", userId)

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    // Validate userId length (max 32 characters per API docs)
    if (typeof userId !== "string" || userId.length > 32) {
      return NextResponse.json(
        { error: "userId must be a string with maximum 32 characters" },
        { status: 400 }
      )
    }

    const conversationId = await createConversation(userId)

    console.log("[v0] API route - Conversation created:", conversationId)

    return NextResponse.json({ conversationId })
  } catch (error) {
    console.error("[v0] API route - Error creating conversation:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create conversation"
    return NextResponse.json(
      { error: errorMessage, stack: error instanceof Error ? error.stack : undefined },
      { status: 500 },
    )
  }
}
