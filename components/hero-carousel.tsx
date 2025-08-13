"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getImageUrl, type Movie } from "@/lib/tmdb"
import { cn } from "@/lib/utils"

interface HeroCarouselProps {
  movies: Movie[]
  onPlay?: (movie: Movie) => void
  onPreview?: (movie: Movie) => void
}

export function HeroCarousel({ movies, onPlay, onPreview }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [movies.length, isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length)
    setIsAutoPlaying(false)
  }

  const handleItemClick = () => {
    if (onPreview) {
      onPreview(currentMovie)
    } else {
      window.location.href = `/movie/${currentMovie.id}`
    }
  }

  if (!movies.length) return null

  const currentMovie = movies[currentIndex]

  return (
    <div className="relative w-full aspect-video overflow-hidden cursor-pointer" onClick={handleItemClick}>
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={getImageUrl(currentMovie.backdrop_path, "original") || "/placeholder.svg"}
          alt={currentMovie.title}
          fill
          className="object-cover"
          style={{
            filter: "saturate(1.3)",
          }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="flex items-center justify-between w-full h-full p-4 md:p-6">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-orange-500 text-white text-xs">New Movies</Badge>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-white text-xs">{currentMovie.vote_average.toFixed(1)}</span>
              </div>
            </div>

            <h3 className="text-lg md:text-4xl font-bold text-white mb-2 leading-tight cursor-pointer hover:text-orange-300 transition-colors py-3">
              {currentMovie.title}
            </h3>

           
            <div className="flex gap-2">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onPlay?.(currentMovie)
                }}
              >
                <Play className="w-3 h-3 mr-1" />
                Play Now
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Arrows and Dots */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-20 hidden lg:flex"
        onClick={(e) => {
          e.stopPropagation()
          goToPrevious()
        }}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-20 hidden lg:flex"
        onClick={(e) => {
          e.stopPropagation()
          goToNext()
        }}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 z-20 hidden lg:flex">
        {movies.map((_, index) => (
          <button
            key={index}
            className={cn("w-2 h-2 transition-all", index === currentIndex ? "bg-orange-500 w-6" : "bg-white/40")}
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex(index)
              setIsAutoPlaying(false)
            }}
          />
        ))}
      </div>
    </div>
  )
}
