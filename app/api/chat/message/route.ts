import type { NextRequest } from "next/server"
import { sendMessageStreaming, type GPTBotsMessage } from "@/lib/gptbots"

export async function POST(request: NextRequest) {
  try {
    const { conversationId, messages } = await request.json()

    console.log("[v0] Message API - conversationId:", conversationId)
    console.log("[v0] Message API - messages count:", messages?.length)

    if (!conversationId || !messages) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Call GPTBots API with streaming using our SSL-bypassing client
    const stream = await sendMessageStreaming(conversationId, messages as GPTBotsMessage[])

    // Transform the stream to SSE format
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const transformedStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader()
        let buffer = ""

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              console.log("[v0] Stream completed")
              break
            }

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""

            for (const line of lines) {
              if (line.trim()) {
                try {
                  // Handle SSE format: "data: {...}" or plain JSON
                  let jsonStr = line.trim()
                  if (jsonStr.startsWith("data:")) {
                    jsonStr = jsonStr.slice(5).trim() // Remove "data:" prefix
                  }
                  
                  if (jsonStr) {
                    const event = JSON.parse(jsonStr)
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
                  }
                } catch (error) {
                  // Not valid JSON, skip
                  console.log("[v0] Skipping non-JSON line:", line.substring(0, 50))
                }
              }
            }
          }

          // Process remaining buffer
          if (buffer.trim()) {
            try {
              let jsonStr = buffer.trim()
              if (jsonStr.startsWith("data:")) {
                jsonStr = jsonStr.slice(5).trim() // Remove "data:" prefix
              }
              
              if (jsonStr) {
                const event = JSON.parse(jsonStr)
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
              }
            } catch {
              // Not valid JSON, skip
            }
          }
        } catch (error) {
          console.error("[v0] Stream error:", error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(transformedStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[v0] Error in chat message:", error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
