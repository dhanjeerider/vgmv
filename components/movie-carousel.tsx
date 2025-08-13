"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MovieCard } from "@/components/movie-card"
import type { Movie, TVShow } from "@/lib/tmdb"
import { cn } from "@/lib/utils"

interface MovieCarouselProps {
  title: string
  items: (Movie | TVShow)[]
  onPlay?: (item: Movie | TVShow) => void
  onAddToWatchlist?: (item: Movie | TVShow) => void
  onViewAll?: () => void
  genreId?: number
  mediaType?: "movie" | "tv"
  className?: string
}

export function MovieCarousel({
  title,
  items,
  onPlay,
  onAddToWatchlist,
  onViewAll,
  genreId,
  mediaType = "movie",
  className,
}: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll()
    } else if (genreId) {
      router.push(`/genre/${genreId}?type=${mediaType}`)
    } else {
      router.push(mediaType === "tv" ? "/tv" : "/movies")
    }
  }

  const handlePlay = (item: Movie | TVShow) => {
    // Add to watch history
    const watchHistory = JSON.parse(localStorage.getItem("watch-history") || "[]")
    const isMovie = "title" in item
    const historyItem = {
      id: item.id,
      title: isMovie ? item.title : item.name,
      poster_path: item.poster_path,
      watchedAt: new Date().toISOString(),
      type: isMovie ? "movie" : "tv",
    }

    // Remove existing entry if it exists and add new one at the beginning
    const filtered = watchHistory.filter((historyItem: any) => historyItem.id !== item.id)
    filtered.unshift(historyItem)
    localStorage.setItem("watch-history", JSON.stringify(filtered.slice(0, 50)))

    // Call the original onPlay function
    onPlay?.(item)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
          {title}
        </h2>
        <Button
          className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black font-semibold px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          onClick={handleViewAll}
        >
          View All
        </Button>
      </div>

      <div className="relative group">
        <div ref={scrollRef} className="carousel-container flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
          {items.map((item) => (
            <div key={item.id} className="flex-none w-[160px] sm:w-[180px] lg:w-[200px]">
              <MovieCard item={item} onPlay={handlePlay} onAddToWatchlist={onAddToWatchlist} />
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-lime-400/20 to-green-500/20 backdrop-blur-sm border border-lime-400/30 text-lime-400 hover:from-lime-400/30 hover:to-green-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 rounded-full"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-lime-400/20 to-green-500/20 backdrop-blur-sm border border-lime-400/30 text-lime-400 hover:from-lime-400/30 hover:to-green-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 rounded-full"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
