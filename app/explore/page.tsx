"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { MovieCard } from "@/components/movie-card"
import { VideoPlayer } from "@/components/video-player"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tmdbApi, type Movie, type TVShow } from "@/lib/tmdb"
import { User, Search, Filter, Grid, List } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ExplorePage() {
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([])
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("popularity.desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItem, setSelectedItem] = useState<Movie | TVShow | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    loadGenres()
    loadTrending()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      searchContent()
    } else {
      loadTrending()
    }
  }, [searchQuery, selectedGenre, selectedYear, selectedType, sortBy])

  const loadGenres = async () => {
    try {
      const [movieGenres, tvGenres] = await Promise.all([tmdbApi.getGenres("movie"), tmdbApi.getGenres("tv")])

      // Combine and deduplicate genres
      const allGenres = [...movieGenres.genres, ...tvGenres.genres]
      const uniqueGenres = allGenres.filter((genre, index, self) => index === self.findIndex((g) => g.id === genre.id))

      setGenres(uniqueGenres)
    } catch (error) {
      console.error("Error loading genres:", error)
    }
  }

  const loadTrending = async () => {
    setIsLoading(true)
    try {
      const [trendingMovies, trendingTV] = await Promise.all([
        tmdbApi.getTrending("movie", "week"),
        tmdbApi.getTrending("tv", "week"),
      ])

      const combined = [...trendingMovies.results, ...trendingTV.results]
      setSearchResults(combined.sort(() => Math.random() - 0.5))
    } catch (error) {
      console.error("Error loading trending:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const searchContent = async () => {
    setIsLoading(true)
    try {
      const response = await tmdbApi.search(searchQuery)
      setSearchResults(response.results.filter((item: any) => item.media_type === "movie" || item.media_type === "tv"))
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setIsLoading(false)
    }
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

  const filteredResults = searchResults.filter((item) => {
    const itemType = "title" in item ? "movie" : "tv"
    const itemYear = "release_date" in item ? item.release_date?.split("-")[0] : item.first_air_date?.split("-")[0]

    if (selectedType !== "all" && itemType !== selectedType) return false
    if (selectedYear !== "all" && itemYear !== selectedYear) return false
    if (selectedGenre !== "all" && !item.genre_ids?.includes(Number.parseInt(selectedGenre))) return false

    return true
  })

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen bg-[#0f1316] text-white">
      <Sidebar />

      <main className="md:ml-16 pb-20 md:pb-8">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-bold">Explore</h1>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
              onClick={() => router.push("/profile")}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Filters */}
        <div className="p-4 md:p-6 border-b border-gray-800">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Advanced Filters:</span>
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="tv">TV Shows</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
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

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity.desc">Most Popular</SelectItem>
                <SelectItem value="vote_average.desc">Highest Rated</SelectItem>
                <SelectItem value="release_date.desc">Newest</SelectItem>
                <SelectItem value="title.asc">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {filteredResults.length} results
                {searchQuery && ` for "${searchQuery}"`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="w-8 h-8 p-0"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="w-8 h-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-4 md:p-6">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-gray-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                  : "space-y-4"
              }
            >
              {filteredResults.map((item) => (
                <MovieCard key={item.id} item={item} onPlay={handlePlay} onAddToWatchlist={handleAddToWatchlist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No results found</div>
              <div className="text-gray-500 text-sm">Try adjusting your search terms or filters</div>
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
