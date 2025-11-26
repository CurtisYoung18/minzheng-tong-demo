"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Clock, Trash2, LogOut, ChevronRight, ChevronLeft } from "lucide-react"
import type { ChatSession } from "@/types/chat"

interface User {
  userId: string
  name: string
  phone: string
}

interface ChatSidebarProps {
  user: User
  sessions: ChatSession[]
  activeSessionId: string
  onSelectSession: (id: string) => void
  onNewSession: () => void
  onDeleteSession: (id: string) => void
  isOpen: boolean
  onToggle: () => void
}

const USER_AVATAR = "https://img.icons8.com/color/96/user-male-circle--v1.png"

export default function ChatSidebar({
  user,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isOpen,
  onToggle,
}: ChatSidebarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <div className="relative flex">
      {/* Sidebar content */}
      <div
        className={`h-screen bg-sidebar flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "w-64" : "w-0"
        }`}
      >
        <div className="w-64 h-full flex flex-col">
          {/* Header with user info */}
          <div className="p-4 flex items-center gap-3">
            <img
              src={USER_AVATAR || "/placeholder.svg"}
              alt="用户头像"
              width={44}
              height={44}
              className="rounded-full bg-secondary shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.phone}</p>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="px-3 pb-4">
            <Button
              onClick={onNewSession}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-10 rounded-full text-sm font-medium"
            >
              <PlusCircle className="h-4 w-4" />
              新增会话
            </Button>
          </div>

          {/* Recent Sessions Header */}
          <div className="px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>最近导办记录</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                <Trash2 className="h-3 w-3" />
              </Button>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Sessions List */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-colors ${
                    activeSessionId === session.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50"
                  }`}
                  onClick={() => onSelectSession(session.id)}
                >
                  <span className="flex-1 truncate text-sm">{session.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSession(session.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer with logout */}
          <div className="p-3 border-t border-sidebar-border space-y-2">
            <Button
              variant="outline"
              className="w-full gap-2 text-muted-foreground hover:text-destructive hover:border-destructive bg-transparent text-sm h-9"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </Button>
            <p className="text-xs text-center text-muted-foreground">闽政通 · 公积金边聊边办</p>
          </div>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute top-1/2 -translate-y-1/2 -right-4 z-50 w-8 h-16 bg-sidebar border border-sidebar-border rounded-r-lg flex items-center justify-center hover:bg-sidebar-accent transition-colors shadow-md"
        style={{ left: isOpen ? "calc(16rem - 1px)" : "-1px" }}
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
    </div>
  )
}
