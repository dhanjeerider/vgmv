"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { tmdbApi, getImageUrl, type Movie, type TVShow } from "@/lib/tmdb"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface SearchBarProps {
  onResultClick?: (item: Movie | TVShow) => void
}

export function SearchBar({ onResultClick }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<(Movie | TVShow)[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchMovies = async () => {
      if (query.length < 2) {
        setResults([])
        setShowResults(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await tmdbApi.search(query)
        setResults(response.results.slice(0, 8))
        setShowResults(true)
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchMovies, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleResultClick = (item: Movie | TVShow) => {
    setShowResults(false)
    setQuery("")

    const isMovie = "title" in item
    const path = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`
    router.push(path)

    onResultClick?.(item)
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setShowResults(false)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search movies, TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500"
          onFocus={() => query.length >= 2 && setShowResults(true)}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-400 hover:text-white"
            onClick={clearSearch}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1b1f23] border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">Searching...</div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((item) => {
                const title = "title" in item ? item.title : item.name
                const year =
                  "release_date" in item ? item.release_date?.split("-")[0] : item.first_air_date?.split("-")[0]

                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors text-left"
                    onClick={() => handleResultClick(item)}
                  >
                    <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-700">
                      <Image
                        src={getImageUrl(item.poster_path, "w200") || "/placeholder.svg"}
                        alt={title}
                        width={48}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{title}</h3>
                      <p className="text-sm text-gray-400">
                        {year} • {"title" in item ? "Movie" : "TV Show"}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-400">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
