"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { SearchBar } from "@/components/search-bar"
import { HeroCarousel } from "@/components/hero-carousel"
import { MovieCarousel } from "@/components/movie-carousel"
import { VideoPlayer } from "@/components/video-player"
import { ContinueWatching } from "@/components/continue-watching"
import { BackToTop } from "@/components/back-to-top"
import { TelegramPopup } from "@/components/telegram-popup"
import { NoticeBox } from "@/components/notice-box"
import { tmdbApi, type Movie, type TVShow } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import { User, Film } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [heroMovies, setHeroMovies] = useState<Movie[]>([])
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([])
  const [topThrillers, setTopThrillers] = useState<Movie[]>([])
  const [topSciFi, setTopSciFi] = useState<Movie[]>([])
  const [topKids, setTopKids] = useState<Movie[]>([])
  const [topAction, setTopAction] = useState<Movie[]>([])
  const [topComedy, setTopComedy] = useState<Movie[]>([])
  const [topHorror, setTopHorror] = useState<Movie[]>([])
  const [bollywoodMovies, setBollywoodMovies] = useState<Movie[]>([])
  const [selectedItem, setSelectedItem] = useState<Movie | TVShow | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trending, popular, thriller, scifi, kids, action, comedy, horror, bollywood] = await Promise.all([
          tmdbApi.getTrending("movie", "week"),
          tmdbApi.getPopular("movie"),
          tmdbApi.getByGenre(53, "movie"),
          tmdbApi.getByGenre(878, "movie"),
          tmdbApi.getByGenre(16, "movie"),
          tmdbApi.getByGenre(28, "movie"),
          tmdbApi.getByGenre(35, "movie"),
          tmdbApi.getByGenre(27, "movie"),
          fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=7bffed716d50c95ed1c4790cfab4866a&with_original_language=hi&sort_by=popularity.desc`,
          ).then((res) => res.json()),
        ])

        setHeroMovies(trending.results.slice(0, 6))
        setNowPlayingMovies(popular.results.slice(0, 12))
        setTopThrillers(thriller.results.slice(0, 12))
        setTopSciFi(scifi.results.slice(0, 12))
        setTopKids(kids.results.slice(0, 12))
        setTopAction(action.results.slice(0, 12))
        setTopComedy(comedy.results.slice(0, 12))
        setTopHorror(horror.results.slice(0, 12))
        setBollywoodMovies(bollywood.results.slice(0, 12))
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handlePlay = (item: Movie | TVShow) => {
    setSelectedItem(item)
    setIsPlayerOpen(true)
  }

  const handlePreview = (item: Movie | TVShow) => {
    if ("title" in item) {
      router.push(`/movie/${item.id}`)
    } else {
      router.push(`/tv/${item.id}`)
    }
  }

  const handleAddToWatchlist = (item: Movie | TVShow) => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]")
    const exists = watchlist.find((w: any) => w.id === item.id)

    if (!exists) {
      watchlist.push(item)
      localStorage.setItem("watchlist", JSON.stringify(watchlist))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <TelegramPopup />

      {/* Main Content */}
      <main className="md:ml-16 pb-20 md:pb-8">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold hidden md:block">Vega Movies</span>
            </div>
            <SearchBar onResultClick={handlePreview} />
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

        {/* Hero Section - Full Width */}
        <section className="mb-8">
          {/* Full Width Hero Carousel - No padding, no border radius */}
          <div className="w-full">
            {heroMovies.length > 0 && (
              <HeroCarousel movies={heroMovies} onPlay={handlePlay} onPreview={handlePreview} />
            )}
          </div>
        </section>

        {/* Notice Box */}
        <NoticeBox />

        {/* Movie Carousels */}
        <div className="space-y-8 px-4 md:px-6">
          <MovieCarousel
            title="Now playing movies"
            items={nowPlayingMovies}
            onPlay={handlePlay}
            onAddToWatchlist={handleAddToWatchlist}
            mediaType="movie"
          />

          <MovieCarousel
            title="Top Action Movies"
            items={topAction}
            onPlay={handlePlay}
            onAddToWatchlist={handleAddToWatchlist}
            genreId={28}
            mediaType="movie"
          />

          <MovieCarousel
            title="Bollywood Movies"
            items={bollywoodMovies}
            onPlay={handlePlay}
            onAddToWatchlist={handleAddToWatchlist}
            mediaType="movie"
          />

          <MovieCarousel
            title="Top Thriller"
            items={topThrillers}
            onPlay={handlePlay}
            onAddToWatchlist={handleAddToWatchlist}
            genreId={53}
            mediaType="movie"
          />

          <MovieCarousel
            title="Top Comedy"
            items={topComedy}
            onPlay={handlePlay}
            onAddToWatchlist={handleAddToWatchlist}
            genreId={35}
            mediaType="movie"
          />

          <MovieCarousel
            title="Top Sci-Fi"
            items={topSciFi}
            onPlay={handlePlay}
            onAddToWatchlist={handleAddToWatchlist}
            genreId={878}
            mediaType="movie"
          />

          <MovieCarousel
            title="Top Horror"
            items={topHorror}
            onPlay={handlePlay}
            onAddToWatchlist={handleAddToWatchlist}
            genreId={27}
            mediaType="movie"
          />

          <MovieCarousel
            title="Top Kids"
            items={topKids}
            onPlay={handlePlay}
            onAddToWatchlist={handleAddToWatchlist}
            genreId={16}
            mediaType="movie"
          />
        </div>
      </main>

      <BottomNav />
      <ContinueWatching onPlay={(item) => console.log("Continue watching:", item)} />
      <BackToTop />
      <VideoPlayer isOpen={isPlayerOpen} onClose={() => setIsPlayerOpen(false)} item={selectedItem} />
    </div>
  )
}
