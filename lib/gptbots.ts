// GPTBots API Client for Private Deployment (Server-side)
// Uses standard fetch - works in v0 preview and Vercel deployment

const GPTBOTS_API_KEY = process.env.GPTBOTS_API_KEY || "app-O9qte2NIaa2JgFFS7ePpK69c"
const GPTBOTS_BASE_URL = process.env.GPTBOTS_BASE_URL || "https://27.156.118.33:40443"

export interface MessageContent {
  type: "text" | "image" | "audio" | "document"
  text?: string
  image?: Array<{
    base64_content?: string
    url?: string
    format: string
    name: string
  }>
  audio?: Array<{
    base64_content?: string
    url?: string
    format: string
    name: string
  }>
  document?: Array<{
    base64_content?: string
    url?: string
    format: string
    name: string
  }>
}

export interface GPTBotsMessage {
  role: "user" | "assistant"
  content: string | MessageContent[]
}

export interface ConversationConfig {
  long_term_memory?: boolean
  short_term_memory?: boolean
}

export interface CreateConversationResponse {
  conversation_id: string
}

export interface SendMessageResponse {
  create_time: number
  conversation_id: string
  message_id: string
  output: Array<{
    from_component_branch: string
    from_component_name: string
    content: {
      text?: string
      audio?: Array<{
        audio: string
        transcript: string
      }>
    }
  }>
}

// Streaming response types
export interface StreamEvent {
  code: number
  message: string
  data: unknown
}

// Create a new conversation
export async function createConversation(userId: string): Promise<string> {
  const url = `${GPTBOTS_BASE_URL}/v1/conversation`
  console.log("[v0] Creating conversation for user:", userId)
  console.log("[v0] API URL:", url)

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GPTBOTS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    })

    console.log("[v0] Response status:", response.status)
    const responseText = await response.text()
    console.log("[v0] Response body:", responseText.substring(0, 500))

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`)
    }

    const data: CreateConversationResponse = JSON.parse(responseText)
    console.log("[v0] Conversation created:", data.conversation_id)
    return data.conversation_id
  } catch (error) {
    console.error("[v0] Create conversation error:", error)
    throw error
  }
}

// Send message with streaming support
export async function sendMessageStreaming(
  conversationId: string,
  messages: GPTBotsMessage[],
  config?: ConversationConfig,
): Promise<ReadableStream<Uint8Array>> {
  const url = `${GPTBOTS_BASE_URL}/v2/conversation/message`
  console.log("[v0] Sending streaming message to conversation:", conversationId)

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GPTBOTS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      response_mode: "streaming",
      messages,
      conversation_config: config,
    }),
  })

  console.log("[v0] Stream response status:", response.status)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }

  if (!response.body) {
    throw new Error("No response body")
  }

  return response.body
}

// Send message with blocking mode
export async function sendMessageBlocking(
  conversationId: string,
  messages: GPTBotsMessage[],
  config?: ConversationConfig,
): Promise<SendMessageResponse> {
  const url = `${GPTBOTS_BASE_URL}/v2/conversation/message`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GPTBOTS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      response_mode: "blocking",
      messages,
      conversation_config: config,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }

  return response.json() as Promise<SendMessageResponse>
}

// Helper to convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1]
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
  })
}

// Helper to get file format from mime type
export function getFileFormat(mimeType: string): string {
  const formatMap: Record<string, string> = {
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/wav": "wav",
    "application/pdf": "pdf",
    "text/plain": "txt",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "text/csv": "csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "text/html": "html",
    "application/json": "json",
    "text/markdown": "md",
  }
  return formatMap[mimeType] || "txt"
}

// Helper to determine content type from file
export function getContentType(file: File): "image" | "audio" | "document" {
  if (file.type.startsWith("image/")) return "image"
  if (file.type.startsWith("audio/")) return "audio"
  return "document"
}

// Parse streaming response
export function parseStreamEvent(line: string): StreamEvent | null {
  if (!line.trim()) return null
  try {
    return JSON.parse(line)
  } catch {
    return null
  }
}
