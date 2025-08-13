"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { SearchBar } from "@/components/search-bar"
import { MovieCard } from "@/components/movie-card"
import { VideoPlayer } from "@/components/video-player"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tmdbApi, type Movie, type TVShow } from "@/lib/tmdb"
import { User, ArrowLeft, Film } from "lucide-react"

const languages = [
  { code: "all", name: "All Languages" },
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
]

const sortOptions = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "release_date.desc", label: "Recently Added" },
  { value: "vote_average.desc", label: "Highest Rated" },
]

export default function GenrePage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [items, setItems] = useState<(Movie | TVShow)[]>([])
  const [genreName, setGenreName] = useState("")
  const [mediaType, setMediaType] = useState<"movie" | "tv">((searchParams.get("type") as "movie" | "tv") || "movie")
  const [language, setLanguage] = useState("all")
  const [sortBy, setSortBy] = useState("popularity.desc")
  const [selectedItem, setSelectedItem] = useState<Movie | TVShow | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const genreId = Number.parseInt(params.id as string)

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    loadGenreData()
  }, [genreId, mediaType, language, sortBy])

  const loadGenreData = async (pageNum = 1, append = false) => {
    if (pageNum === 1) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const genresResponse = await tmdbApi.getGenres(mediaType)
      const genre = genresResponse.genres.find((g: any) => g.id === genreId)
      setGenreName(genre?.name || searchParams.get("name") || "Unknown Genre")

      const data = await tmdbApi.getByGenre(genreId, mediaType, pageNum)

      let filteredResults = data.results || []

      if (language !== "all") {
        filteredResults = filteredResults.filter((item: any) => item.original_language === language)
      }

      if (sortBy === "vote_average.desc") {
        filteredResults.sort((a: any, b: any) => b.vote_average - a.vote_average)
      } else if (sortBy === "release_date.desc") {
        filteredResults.sort((a: any, b: any) => {
          const dateA = new Date(a.release_date || a.first_air_date || 0)
          const dateB = new Date(b.release_date || b.first_air_date || 0)
          return dateB.getTime() - dateA.getTime()
        })
      }

      console.log("Genre data loaded:", { mediaType, genreId, count: filteredResults.length })

      if (append) {
        setItems((prev) => [...prev, ...filteredResults])
      } else {
        setItems(filteredResults)
      }

      setHasMore(pageNum < (data.total_pages || 1))
    } catch (error) {
      console.error("Error loading genre data:", error)
      if (!append) setItems([])
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const loadMoreItems = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadGenreData(nextPage, true)
  }

  const handlePlay = (item: Movie | TVShow) => {
    setSelectedItem(item)
    setIsPlayerOpen(true)
  }

  const handleAddToWatchlist = (item: Movie | TVShow) => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]")
    const exists = watchlist.find((w: any) => w.id === item.id)

    if (!exists) {
      watchlist.push({ ...item, addedAt: new Date().toISOString() })
      localStorage.setItem("watchlist", JSON.stringify(watchlist))
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />

      <main className="md:ml-16 pb-20 md:pb-8">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3" onClick={() => router.push("/")}>
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold hidden cursor-pointer select-none md:block">Vega Movies</span>
            </div>
            <SearchBar onResultClick={handlePlay} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/profile")}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Title and Filters */}
        <div className="p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-4">{genreName}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Select value={mediaType} onValueChange={(value: "movie" | "tv") => setMediaType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="tv">TV Shows</SelectItem>
              </SelectContent>
            </Select>

            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Items Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {items.map((item) => (
                  <MovieCard key={item.id} item={item} onPlay={handlePlay} onAddToWatchlist={handleAddToWatchlist} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={loadMoreItems}
                    disabled={isLoadingMore}
                    className="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No {mediaType === "movie" ? "movies" : "TV shows"} found for this genre.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Try changing the filters or selecting a different media type.
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
      <BackToTop />
      <VideoPlayer isOpen={isPlayerOpen} onClose={() => setIsPlayerOpen(false)} item={selectedItem} />
    </div>
  )
}
