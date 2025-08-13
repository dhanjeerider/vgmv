"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { SearchBar } from "@/components/search-bar"
import { MovieCarousel } from "@/components/movie-carousel"
import { VideoPlayer } from "@/components/video-player"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { tmdbApi, getImageUrl, type TVShow } from "@/lib/tmdb"
import { ArrowLeft, Play, Star, User, Heart, Calendar, Globe, Film } from "lucide-react"

export default function TVDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [tvShow, setTVShow] = useState<any>(null)
  const [similarShows, setSimilarShows] = useState<TVShow[]>([])
  const [cast, setCast] = useState<any[]>([])
  const [trailers, setTrailers] = useState<any[]>([])
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadTVDetails(Number.parseInt(params.id as string))
    }
  }, [params.id])

  const loadTVDetails = async (tvId: number) => {
    setIsLoading(true)
    try {
      const tvData = await tmdbApi.getTVDetails(tvId)
      setTVShow(tvData)
      setCast(tvData.credits?.cast?.slice(0, 10) || [])
      setTrailers(tvData.videos?.results?.filter((v: any) => v.type === "Trailer").slice(0, 2) || [])
      setSimilarShows(tvData.similar?.results?.slice(0, 20) || [])

      const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]")
      setIsInWatchlist(watchlist.some((item: any) => item.id === tvId))
    } catch (error) {
      console.error("Error loading TV details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlay = () => {
    setIsPlayerOpen(true)

    const watchHistory = JSON.parse(localStorage.getItem("watch-history") || "[]")
    const historyItem = {
      id: tvShow.id,
      title: tvShow.name,
      poster_path: tvShow.poster_path,
      watchedAt: new Date().toISOString(),
      type: "tv",
      season: selectedSeason,
      episode: selectedEpisode,
    }

    const filtered = watchHistory.filter(
      (item: any) => !(item.id === tvShow.id && item.season === selectedSeason && item.episode === selectedEpisode),
    )
    filtered.unshift(historyItem)
    localStorage.setItem("watch-history", JSON.stringify(filtered.slice(0, 50)))

    const continueWatching = JSON.parse(localStorage.getItem("continue-watching") || "[]")
    const newItem = {
      id: tvShow.id,
      title: tvShow.name,
      poster_path: tvShow.poster_path,
      progress: 0,
      timestamp: Date.now(),
      season: selectedSeason,
      episode: selectedEpisode,
      isTV: true,
    }

    const filteredContinue = continueWatching.filter((item: any) => item.id !== tvShow.id)
    filteredContinue.unshift(newItem)
    localStorage.setItem("continue-watching", JSON.stringify(filteredContinue.slice(0, 10)))
  }

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]")

    if (isInWatchlist) {
      const filtered = watchlist.filter((item: any) => item.id !== tvShow.id)
      localStorage.setItem("watchlist", JSON.stringify(filtered))
      setIsInWatchlist(false)
    } else {
      watchlist.unshift({ ...tvShow, addedAt: new Date().toISOString() })
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

  if (!tvShow) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-xl">TV Show not found</div>
      </div>
    )
  }

  const year = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : "N/A"
  const rating = tvShow.vote_average?.toFixed(1) || "N/A"
  const country = tvShow.production_countries?.[0]?.name || "N/A"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />

      <main className="md:ml-16 pb-20 md:pb-8">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3 w-30">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl w-55 font-bold hidden md:block">Vega Movies</span>
            </div>
            <SearchBar onResultClick={() => {}} />
          </div>

          <div className="flex items-center gap-2 w-20">
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
              src={getImageUrl(tvShow.backdrop_path, "w780") || "/placeholder.svg"}
              alt={tvShow.name}
              fill
              className="object-cover"
              style={{ objectPosition: "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>

          {/* Small poster at bottom left */}
          <div className="absolute bottom-4 left-4 w-20 md:w-45 min-w-[60px] aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={getImageUrl(tvShow.poster_path, "w185") || "/placeholder.svg"}
              alt={tvShow.name}
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
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{tvShow.name}</h1>

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
                  <Globe className="w-4 h-4" />
                  <span>{country}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {tvShow.genres?.map((genre: any) => (
                  <Badge
                    key={genre.id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-orange-500 hover:text-white transition-colors bg-gradient-to-r from-purple-900 to-indigo-600 hover:from-crimson-600 hover:to-red-700"
                    onClick={() => router.push(`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}&type=tv`)}
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handlePlay} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold">
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
                <Button variant="outline" onClick={toggleWatchlist}>
                  <Heart className={`w-4 h-4 mr-2 ${isInWatchlist ? "fill-current text-red-500" : ""}`} />
                  Watchlist
                </Button>
              </div>
            </div>

            {/* TV Show Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-orange-500 w-30">Full Name:</span>
                  <span>{tvShow.name}</span>
                </div>
                <div className="flex">
                  <span className="text-orange-500 w-30">Ratings:</span>
                  <span>{rating}/10</span>
                </div>
                <div className="flex">
                  <span className="text-orange-500 w-30">Status:</span>
                  <span>{tvShow.status || "Ended"}</span>
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
                  <span className="text-orange-500 w-30">Seasons:</span>
                  <span>{tvShow.number_of_seasons || "N/A"}</span>
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
              <p className="text-muted-foreground leading-relaxed">{tvShow.overview}</p>
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
                      <div className="w-20 h-auto rounded m-auto  overflow-hidden mb-2">
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

          {/* Similar Shows */}
          {similarShows.length > 0 && (
            <div className="mt-12">
              <MovieCarousel
                title="you may also like"
                items={similarShows}
                onPlay={(item) => router.push(`/tv/${item.id}`)}
                onAddToWatchlist={() => {}}
              />
            </div>
          )}
        </div>
      </main>

      <BottomNav />
      <BackToTop />

      <VideoPlayer
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        item={tvShow}
        season={selectedSeason}
        episode={selectedEpisode}
      />
    </div>
  )
}
