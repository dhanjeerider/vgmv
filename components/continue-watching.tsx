"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getImageUrl } from "@/lib/tmdb"

interface ContinueWatchingItem {
  id: number
  title: string
  poster_path: string
  progress: number
  timestamp: number
  season?: number
  episode?: number
  isTV: boolean
}

interface ContinueWatchingProps {
  onPlay?: (item: ContinueWatchingItem) => void
}

export function ContinueWatching({ onPlay }: ContinueWatchingProps) {
  const [currentItem, setCurrentItem] = useState<ContinueWatchingItem | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("continue-watching")
    if (saved) {
      try {
        const items: ContinueWatchingItem[] = JSON.parse(saved)
        const latest = items.sort((a, b) => b.timestamp - a.timestamp)[0]
        if (latest && latest.progress > 5 && latest.progress < 95) {
          setCurrentItem(latest)
          setIsVisible(true)
        }
      } catch (error) {
        console.error("Error loading continue watching:", error)
      }
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handlePlay = () => {
    if (currentItem && onPlay) {
      onPlay(currentItem)
    }
  }

  if (!isVisible || !currentItem) return null

  return (
    <div className="continue-watching">
      <div className="flex items-center gap-3">
        <div className="w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={getImageUrl(currentItem.poster_path, "w200") || "/placeholder.svg"}
            alt={currentItem.title}
            width={64}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate mb-1">{currentItem.title}</h3>
          {currentItem.isTV && (
            <p className="text-xs text-gray-400 mb-1">
              S{currentItem.season} E{currentItem.episode}
            </p>
          )}
          <Progress value={currentItem.progress} className="h-1 mb-2" />
          <p className="text-xs text-gray-400">Continue watching • {Math.round(currentItem.progress)}% complete</p>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white px-3" onClick={handlePlay}>
            <Play className="w-3 h-3 mr-1" />
            Resume
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-white" onClick={handleClose}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
