import { NextRequest, NextResponse } from "next/server"
import http from "http"
import https from "https"

const TITLE_AGENT_API_KEY = "app-VZ7GUp9stS2CbkFMFrLIBqXy"
const GPTBOTS_BASE_URL = process.env.GPTBOTS_BASE_URL || "https://27.156.118.33:40443"

// Create HTTPS agent that ignores SSL certificate errors
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

// Custom fetch function that bypasses SSL certificate validation
async function fetchWithSSLBypass(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const isHttps = urlObj.protocol === "https:"
    const httpModule = isHttps ? https : http
    
    const requestOptions: http.RequestOptions | https.RequestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: options.headers as Record<string, string>,
      ...(isHttps ? { agent: httpsAgent } : {}),
    }

    const req = httpModule.request(requestOptions, (res) => {
      const chunks: Buffer[] = []
      
      res.on("data", (chunk) => {
        chunks.push(chunk)
      })

      res.on("end", () => {
        const body = Buffer.concat(chunks)
        
        const response = new Response(body, {
          status: res.statusCode || 200,
          statusText: res.statusMessage || "OK",
          headers: res.headers as HeadersInit,
        })
        
        resolve(response)
      })
    })

    req.on("error", (error: any) => {
      reject(error)
    })

    if (options.body) {
      if (typeof options.body === "string") {
        req.write(options.body)
      }
    }

    req.end()
  })
}

export async function POST(request: NextRequest) {
  try {
    const { userId, conversationHistory } = await request.json()

    if (!userId || !conversationHistory) {
      return NextResponse.json(
        { error: "Missing userId or conversationHistory" },
        { status: 400 }
      )
    }

    console.log("[Title API] Generating title for conversation...")
    console.log("[Title API] Conversation history:", conversationHistory.substring(0, 200))

    // Step 1: Create a new conversation for title generation
    const convResponse = await fetchWithSSLBypass(`${GPTBOTS_BASE_URL}/v1/conversation`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TITLE_AGENT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    })

    if (!convResponse.ok) {
      const errorText = await convResponse.text()
      console.error("[Title API] Failed to create conversation:", errorText)
      throw new Error(`Failed to create conversation: ${errorText}`)
    }

    const convData = await convResponse.json()
    const conversationId = convData.conversation_id
    console.log("[Title API] Created conversation:", conversationId)

    // Step 2: Send the conversation history to get a title
    const messageResponse = await fetchWithSSLBypass(`${GPTBOTS_BASE_URL}/v2/conversation/message`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TITLE_AGENT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        response_mode: "blocking",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: conversationHistory,
              },
            ],
          },
        ],
      }),
    })

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text()
      console.error("[Title API] Failed to get title:", errorText)
      throw new Error(`Failed to get title: ${errorText}`)
    }

    const messageData = await messageResponse.json()
    console.log("[Title API] Response:", JSON.stringify(messageData).substring(0, 500))

    // Extract the title from the response
    let title = "新会话"
    if (messageData.output && messageData.output.length > 0) {
      const output = messageData.output[0]
      if (output.content?.text) {
        // Clean up the title - remove extra whitespace and limit to 20 characters
        title = output.content.text.trim().replace(/\n/g, " ").substring(0, 20)
      }
    }

    console.log("[Title API] Generated title:", title)

    return NextResponse.json({ title })
  } catch (error) {
    console.error("[Title API] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

