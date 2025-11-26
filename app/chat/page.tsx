import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ChatLayout from "@/components/chat/chat-layout"

export default async function ChatPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get("user_session")

  if (!session) {
    redirect("/login")
  }

  const user = JSON.parse(session.value)

  return <ChatLayout user={user} />
}
