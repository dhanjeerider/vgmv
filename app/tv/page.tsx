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

const filterTabs = [
  { id: "popular", label: "Popular" },
  { id: "top", label: "Top" },
  { id: "airing", label: "Airing" },
  { id: "genre", label: "Genre" },
  { id: "language", label: "Language" },
]

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

const sortOptions = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "first_air_date.desc", label: "Recently Added" },
  { value: "name.asc", label: "A-Z" },
  { value: "name.desc", label: "Z-A" },
]

const yearOptions = [
  { value: "all", label: "All Years" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
]

export default function TVShowsPage() {
  const router = useRouter()
  const [tvShows, setTVShows] = useState<TVShow[]>([])
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([])
  const [activeTab, setActiveTab] = useState("popular")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("popularity.desc")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<Movie | TVShow | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    loadGenres()
    loadTVShows()
  }, [])

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    loadTVShows()
  }, [activeTab, selectedGenre, selectedLanguage, sortBy, selectedYear])

  const loadGenres = async () => {
    try {
      const response = await tmdbApi.getGenres("tv")
      setGenres(response.genres || [])
    } catch (error) {
      console.error("Error loading genres:", error)
    }
  }

  const loadTVShows = async (pageNum = 1, append = false) => {
    if (pageNum === 1) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      let response
      switch (activeTab) {
        case "popular":
          response = await tmdbApi.getPopular("tv", pageNum)
          break
        case "top":
          response = await tmdbApi.getTopRated("tv", pageNum)
          break
        case "airing":
          response = await tmdbApi.getTrending("tv", "week", pageNum)
          break
        case "genre":
          if (selectedGenre !== "all") {
            response = await tmdbApi.getByGenre(Number.parseInt(selectedGenre), "tv", pageNum)
          } else {
            response = await tmdbApi.getPopular("tv", pageNum)
          }
          break
        case "language":
          if (selectedLanguage !== "all") {
            const url = `https://api.themoviedb.org/3/discover/tv?api_key=7bffed716d50c95ed1c4790cfab4866a&with_original_language=${selectedLanguage}&sort_by=${sortBy}&page=${pageNum}`
            const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`)
            response = await res.json()
          } else {
            response = await tmdbApi.getPopular("tv", pageNum)
          }
          break
        default:
          response = await tmdbApi.getPopular("tv", pageNum)
      }

      if (append) {
        setTVShows((prev) => [...prev, ...response.results])
      } else {
        setTVShows(response.results || [])
      }

      setHasMore(pageNum < (response.total_pages || 1))
    } catch (error) {
      console.error("Error loading TV shows:", error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const loadMoreTVShows = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      loadTVShows(nextPage, true)
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

        {/* Title and Filter Tabs */}
        <div className="p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-4">Browse TV shows</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {filterTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={
                  activeTab === tab.id
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "border-border text-muted-foreground hover:bg-accent"
                }
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            {activeTab === "genre" && (
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Genre" />
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
            )}

            {activeTab === "language" && (
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
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
        </div>

        {/* TV Shows Grid */}
        <div className="p-4 md:p-6">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {tvShows.map((show) => (
                  <MovieCard key={show.id} item={show} onPlay={handlePlay} onAddToWatchlist={handleAddToWatchlist} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={loadMoreTVShows}
                    disabled={isLoadingMore}
                    className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Loading...
                      </>
                    ) : (
                      "Load More TV Shows"
                    )}
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
