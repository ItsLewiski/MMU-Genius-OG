"use client"

import { Button } from "@/components/ui/button"
import { Plus, Trash2, X, ArchiveX, CreditCard } from "lucide-react"
import { MmuGeniusLogo } from "@/components/logo"

interface Chat {
  id: string
  title: string
  messages: any[]
  createdAt: Date
  updatedAt: Date
}

interface ChatSidebarProps {
  chats: Chat[]
  activeChat: string | null
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  onClose: () => void
  onClearHistory: () => void
  onUpgradeClick?: () => void
}

export function ChatSidebar({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onClose,
  onClearHistory,
  onUpgradeClick,
}: ChatSidebarProps) {
  // Format date to readable string
  const formatDate = (date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const chatDate = new Date(date)
    const chatDay = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate())

    if (chatDay.getTime() === today.getTime()) {
      return "Today"
    } else if (chatDay.getTime() === yesterday.getTime()) {
      return "Yesterday"
    } else {
      return chatDate.toLocaleDateString()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <MmuGeniusLogo width={32} height={32} className="mr-2" />
          <h2 className="font-bold text-study-purple">MMU Genius Chat</h2>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        <Button onClick={onNewChat} className="w-full bg-study-purple hover:bg-study-blue text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 px-2">Recent Chats</h3>

        {chats.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center p-4">No chats yet</p>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center justify-between rounded-lg p-3 cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  activeChat === chat.id
                    ? "bg-study-purple/10 dark:bg-study-purple/20 border border-study-purple/30"
                    : ""
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${activeChat === chat.id ? "text-study-purple" : ""}`}>
                    {chat.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(chat.updatedAt)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteChat(chat.id)
                  }}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        {chats.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mb-4 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={onClearHistory}
          >
            <ArchiveX className="h-4 w-4 mr-2" />
            Clear All Chats
          </Button>
        )}

        {/* Upgrade button moved to bottom of sidebar */}
        {onUpgradeClick && (
          <Button
            onClick={onUpgradeClick}
            className="w-full mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Upgrade
          </Button>
        )}

        <p className="text-xs text-muted-foreground text-center">MMU Genius Chat Assistant</p>
      </div>
    </div>
  )
}
