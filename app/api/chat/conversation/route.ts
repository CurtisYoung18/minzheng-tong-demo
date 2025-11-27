import { type NextRequest, NextResponse } from "next/server"
import { createConversation, updateUserProperties, type PropertyValue } from "@/lib/gptbots"
import { getUserAttributes } from "@/lib/db"

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

    // Create conversation
    const conversationId = await createConversation(userId)
    console.log("[v0] API route - Conversation created:", conversationId)

    // Fetch user attributes from database and sync to GPTBots
    try {
      const userAttributes = await getUserAttributes(userId)
      
      if (userAttributes) {
        console.log("[v0] User attributes found:", userAttributes)
        
        // Build property values array for GPTBots
        const propertyValues: PropertyValue[] = [
          { property_name: "city", value: userAttributes.city },
          { property_name: "phase", value: userAttributes.phase },
        ]

        // Sync user attributes to GPTBots
        const syncResult = await updateUserProperties(userId, propertyValues)
        console.log("[v0] User properties sync result:", syncResult)
      } else {
        console.log("[v0] No user attributes found for userId:", userId)
      }
    } catch (attrError) {
      // Don't fail the whole request if attribute sync fails
      console.error("[v0] Failed to sync user attributes:", attrError)
    }

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
