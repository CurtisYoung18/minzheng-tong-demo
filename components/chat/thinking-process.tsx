"use client"

import { useState, useEffect } from "react"
import { Sparkles, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThinkingProcessProps {
  thinking: string
  isComplete?: boolean
  className?: string
}

export default function ThinkingProcess({ thinking, isComplete = false, className }: ThinkingProcessProps) {
  const [isExpanded, setIsExpanded] = useState(!isComplete) // Auto-expand while thinking
  const [displayedText, setDisplayedText] = useState("")

  // Auto-collapse when thinking completes
  useEffect(() => {
    if (isComplete && isExpanded) {
      // Delay collapse slightly to show completion
      const timer = setTimeout(() => {
        setIsExpanded(false)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (!isComplete && thinking) {
      // Auto-expand while streaming
      setIsExpanded(true)
    }
  }, [isComplete, thinking])

  // Typewriter effect for thinking content
  useEffect(() => {
    if (!isExpanded || !thinking) {
      setDisplayedText("")
      return
    }

    // If complete, show all text immediately
    if (isComplete) {
      setDisplayedText(thinking)
      return
    }

    // Typewriter effect while streaming
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < thinking.length) {
        setDisplayedText(thinking.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 10) // Adjust speed as needed

    return () => clearInterval(interval)
  }, [thinking, isExpanded, isComplete])

  if (!thinking) return null

  return (
    <div
      className={cn(
        "bg-gray-50 dark:bg-muted/50 border border-gray-200 dark:border-border rounded-lg overflow-hidden transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-100/50 dark:hover:bg-muted/80 transition-colors group"
      >
        <div className="flex items-center gap-2 text-sm">
          <div className="relative">
            {isComplete ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
            )}
            {!isComplete && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2 w-2 bg-purple-400 rounded-full animate-ping" />
              </div>
            )}
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {isComplete ? "思考完成" : "正在思考..."}
          </span>
          {!isExpanded && thinking && (
            <span className="text-xs text-muted-foreground ml-2 truncate max-w-[200px]">
              {thinking.substring(0, 50)}...
            </span>
          )}
        </div>
        <div
          className={cn(
            "transition-transform duration-300",
            isExpanded ? "rotate-180" : "rotate-0"
          )}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
          )}
        </div>
      </button>

      {/* Content Area */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-3 border-t border-gray-200 dark:border-border bg-white/50 dark:bg-black/20">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-sm font-mono">
              {displayedText}
              {!isComplete && isExpanded && (
                <span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse" />
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

