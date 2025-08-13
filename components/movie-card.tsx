"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getImageUrl, type Movie, type TVShow } from "@/lib/tmdb"
import { cn } from "@/lib/utils"

interface MovieCardProps {
  item: Movie | TVShow
  onPlay?: (item: Movie | TVShow) => void
  onAddToWatchlist?: (item: Movie | TVShow) => void
  className?: string
}

export function MovieCard({ item, onPlay, onAddToWatchlist, className }: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const router = useRouter()

  const title = "title" in item ? item.title : item.name
  const releaseDate = "release_date" in item ? item.release_date : item.first_air_date
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A"
  const rating = item.vote_average.toFixed(1)
  const isMovie = "title" in item

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()

    const watchHistory = JSON.parse(localStorage.getItem("watch-history") || "[]")
    const historyItem = {
      id: item.id,
      title: isMovie ? item.title : item.name,
      poster_path: item.poster_path,
      watchedAt: new Date().toISOString(),
      type: isMovie ? "movie" : "tv",
    }

    const filtered = watchHistory.filter((historyItem: any) => historyItem.id !== item.id)
    filtered.unshift(historyItem)
    localStorage.setItem("watch-history", JSON.stringify(filtered.slice(0, 50)))

    onPlay?.(item)
  }

  const handleCardClick = () => {
    const url = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`
    router.push(url)
  }

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <div
        className={cn(
          "movie-card group relative overflow-hidden transition-all duration-300 hover:scale-101",
          className,
        )}
      >
        <div className="aspect-[9/13] relative">
          <div className="relative h-full overflow-hidden rounded-lg">
            {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />}
            <Image
              src={getImageUrl(item.poster_path, "w342") || "/placeholder.svg"}
              alt={title}
              fill
              className={cn(
                "poster-image object-cover transition-all duration-300 rounded-lg",
                imageLoaded ? "opacity-100" : "opacity-0",
              )}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{
                filter: "saturate(1.2) drop-shadow(0 8px 16px rgba(0,0,0,0.4))",
              }}
            />

         
            <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              {rating}
            </div>
          </div>
        </div>

        <div className="p-3 space-y-2">
          <h3 className="font-semibold truncate text-foreground text-sm line-clamp-2 leading-tight select-none text-center">{title}</h3>
         
        </div>
      </div>
    </div>
  )
}
