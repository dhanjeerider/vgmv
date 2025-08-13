"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { MovieCarousel } from "@/components/movie-carousel"
import { VideoPlayer } from "@/components/video-player"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { tmdbApi, getImageUrl, type Movie } from "@/lib/tmdb"
import { ArrowLeft, Play, Star, User, Heart, Calendar, Clock, Globe, Film } from "lucide-react"

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [movie, setMovie] = useState<any>(null)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [cast, setCast] = useState<any[]>([])
  const [trailers, setTrailers] = useState<any[]>([])
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const movieId = Number.parseInt(params.id as string)
      if (!isNaN(movieId)) {
        loadMovieDetails(movieId)
      } else {
        router.push("/movies")
      }
    }
  }, [params.id, router])

  const loadMovieDetails = async (movieId: number) => {
    setIsLoading(true)
    try {
      const movieData = await tmdbApi.getMovieDetails(movieId)
      setMovie(movieData)
      setCast(movieData.credits?.cast?.slice(0, 10) || [])
      setTrailers(movieData.videos?.results?.filter((v: any) => v.type === "Trailer").slice(0, 2) || [])
      setSimilarMovies(movieData.similar?.results?.slice(0, 20) || [])

      const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]")
      setIsInWatchlist(watchlist.some((item: any) => item.id === movieId))
    } catch (error) {
      console.error("Error loading movie details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlay = () => {
    setIsPlayerOpen(true)

    const watchHistory = JSON.parse(localStorage.getItem("watch-history") || "[]")
    const historyItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      watchedAt: new Date().toISOString(),
      type: "movie",
      runtime: movie.runtime || 120,
    }

    const filtered = watchHistory.filter((item: any) => item.id !== movie.id)
    filtered.unshift(historyItem)
    localStorage.setItem("watch-history", JSON.stringify(filtered.slice(0, 50)))

    const continueWatching = JSON.parse(localStorage.getItem("continue-watching") || "[]")
    const newItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      progress: 0,
      timestamp: Date.now(),
      isTV: false,
    }

    const filteredContinue = continueWatching.filter((item: any) => item.id !== movie.id)
    filteredContinue.unshift(newItem)
    localStorage.setItem("continue-watching", JSON.stringify(filteredContinue.slice(0, 10)))
  }

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]")

    if (isInWatchlist) {
      const filtered = watchlist.filter((item: any) => item.id !== movie.id)
      localStorage.setItem("watchlist", JSON.stringify(filtered))
      setIsInWatchlist(false)
    } else {
      watchlist.unshift({ ...movie, addedAt: new Date().toISOString() })
      localStorage.setItem("watchlist", JSON.stringify(watchlist))
      setIsInWatchlist(true)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Movie not found</div>
          <Button onClick={() => router.push("/movies")}>Back to Movies</Button>
        </div>
      </div>
    )
  }

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"
  const rating = movie.vote_average?.toFixed(1) || "N/A"
  const runtime = movie.runtime ? `${movie.runtime} min` : "N/A"
  const country = movie.production_countries?.[0]?.name || "N/A"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />

      <main className="md:ml-16 pb-20 md:pb-8">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <Button variant="ghost" cursure-poimsize="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3"  onClick={() => router.push("/")}>
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold hidden md:block">vegamovies</span>
            </div>
            <SearchBar onResultClick={() => {}} />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
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

        {/* Hero Section with contained backdrop and absolute poster */}
        <div className="relative overflow-hidden mx-4 md:mx-6 mt-4 rounded-xl h-[30vh] md:h-[80vh] lg:h-[80vh]">
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(movie.backdrop_path, "w780") || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover"
              style={{ objectPosition: "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>

          {/* Small poster at bottom left */}
          <div className="absolute bottom-4 left-4 w-20 md:w-45 min-w-[60px] aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={getImageUrl(movie.poster_path, "w185") || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
        </div>


        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 mt-8">
          <div className="space-y-6">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>August 4, {year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{runtime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{country}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres?.map((genre: any) => (
                  <Badge
                    key={genre.id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-orange-500 hover:text-white transition-colors"
                    onClick={() => router.push(`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`)}
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handlePlay} className="bg-orange-500 hover:bg-orange-600">
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
                <Button variant="outline" onClick={toggleWatchlist}>
                  <Heart className={`w-4 h-4 mr-2 ${isInWatchlist ? "fill-current text-red-500" : ""}`} />
                  Watchlist
                </Button>
              </div>
            </div>

            {/* Movie Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-orange-500 w-30">Full Name:</span>
                  <span>{movie.title}</span>
                </div>
                <div className="flex">
                  <span className="text-orange-500 w-30">Ratings:</span>
                  <span>{rating}/10</span>
                </div>
                <div className="flex">
                  <span className="text-orange-500 w-30">Status:</span>
                  <span>{movie.status || "Released"}</span>
                </div>
                <div className="flex">
                  <span className="text-orange-500 w-30">Released:</span>
                  <span>{year}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-orange-500 w-30">Country:</span>
                  <span>{country}</span>
                </div>
                <div className="flex">
                  <span className="text-orange-500 w-30">Run Time:</span>
                  <span>{runtime}</span>
                </div>
                <div className="flex">
                  <span className="text-orange-500 w-30">IMDB Rating:</span>
                  <span>{rating}</span>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h2 className="text-xl font-bold mb-3">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
            </div>

            {/* Trailer */}
            {trailers.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-3">Trailer</h2>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailers[0].key}`}
                    title={trailers[0].name}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Cast */}
            {cast.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-3">Cast</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {cast.map((actor) => (
                    <div key={actor.id} className="flex-none text-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-2 bg-muted">
                        <Image
                          src={getImageUrl(actor.profile_path, "w185") || "/placeholder.svg"}
                          alt={actor.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-medium">{actor.name}</p>
                      <p className="text-xs text-muted-foreground">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <div className="mt-12">
              <MovieCarousel
                title="What do you think?"
                items={similarMovies}
                onPlay={(item) => router.push(`/movie/${item.id}`)}
                onAddToWatchlist={() => {}}
              />
            </div>
          )}
        </div>
      </main>

      <BottomNav />
      <BackToTop />
      <VideoPlayer isOpen={isPlayerOpen} onClose={() => setIsPlayerOpen(false)} item={movie} />
    </div>
  )
}
