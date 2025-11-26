import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Home() {
  const cookieStore = await cookies()
  const session = cookieStore.get("user_session")

  if (session) {
    redirect("/chat")
  } else {
    redirect("/login")
  }
}
