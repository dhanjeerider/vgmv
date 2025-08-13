"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { SearchBar } from "@/components/search-bar"
import { MovieCard } from "@/components/movie-card"
import { VideoPlayer } from "@/components/video-player"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tmdbApi, type Movie, type TVShow } from "@/lib/tmdb"
import { User, Film } from "lucide-react"

const languages = [
  { code: "all", name: "All Languages" },
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
]

export default function MoviesPage() {
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("popularity.desc")
  const [selectedItem, setSelectedItem] = useState<Movie | TVShow | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadGenres()
    loadMovies()
  }, [])

  useEffect(() => {
    loadMovies()
  }, [selectedGenre, selectedLanguage, sortBy])

  const loadGenres = async () => {
    try {
      const response = await tmdbApi.getGenres("movie")
      setGenres(response.genres || [])
    } catch (error) {
      console.error("Error loading genres:", error)
    }
  }

  const loadMovies = async (pageNum = 1, append = false) => {
    setIsLoading(true)
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=7bffed716d50c95ed1c4790cfab4866a&sort_by=${sortBy}&page=${pageNum}`

      if (selectedGenre !== "all") {
        url += `&with_genres=${selectedGenre}`
      }

      if (selectedLanguage !== "all") {
        url += `&with_original_language=${selectedLanguage}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (append) {
        setMovies((prev) => [...prev, ...data.results])
      } else {
        setMovies(data.results)
      }

      setHasMore(pageNum < data.total_pages)
    } catch (error) {
      console.error("Error loading movies:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadMovies(nextPage, true)
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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold hidden md:block">Vega Movies</span>
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
          <h1 className="text-2xl font-bold mb-4">Movies</h1>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id.toString()}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity.desc">Most Popular</SelectItem>
                <SelectItem value="vote_average.desc">Highest Rated</SelectItem>
                <SelectItem value="release_date.desc">Recently Added</SelectItem>
                <SelectItem value="title.asc">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="p-4 md:p-6">
          {isLoading && movies.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} item={movie} onPlay={handlePlay} onAddToWatchlist={handleAddToWatchlist} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={loadMore}
                    disabled={isLoading}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                  >
                    {isLoading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <BottomNav />
      <BackToTop />

      <VideoPlayer isOpen={isPlayerOpen} onClose={() => setIsPlayerOpen(false)} item={selectedItem} />
    </div>
  )
}
