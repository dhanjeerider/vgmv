"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { MovieCard } from "@/components/movie-card"
import { VideoPlayer } from "@/components/video-player"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getImageUrl, type Movie, type TVShow } from "@/lib/tmdb"
import { User, Crown, Heart, Clock, Trash2, Edit, History } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [watchlist, setWatchlist] = useState<(Movie | TVShow)[]>([])
  const [continueWatching, setContinueWatching] = useState<any[]>([])
  const [watchHistory, setWatchHistory] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<Movie | TVShow | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string>("")
  const [username, setUsername] = useState("dktechnozone")

  const router = useRouter()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    // Load watchlist
    const savedWatchlist = localStorage.getItem("watchlist")
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    }

    // Load continue watching
    const savedContinueWatching = localStorage.getItem("continue-watching")
    if (savedContinueWatching) {
      setContinueWatching(JSON.parse(savedContinueWatching))
    }

    // Load watch history
    const savedWatchHistory = localStorage.getItem("watch-history")
    if (savedWatchHistory) {
      setWatchHistory(JSON.parse(savedWatchHistory))
    }

    // Load profile image
    const savedProfileImage = localStorage.getItem("profile-image")
    if (savedProfileImage) {
      setProfileImage(savedProfileImage)
    }

    // Load username
    const savedUsername = localStorage.getItem("username")
    if (savedUsername) {
      setUsername(savedUsername)
    }
  }

  const handlePlay = (item: Movie | TVShow) => {
    setSelectedItem(item)
    setIsPlayerOpen(true)
  }

  const removeFromWatchlist = (id: number) => {
    const updated = watchlist.filter((item) => item.id !== id)
    setWatchlist(updated)
    localStorage.setItem("watchlist", JSON.stringify(updated))
  }

  const clearContinueWatching = () => {
    setContinueWatching([])
    localStorage.removeItem("continue-watching")
  }

  const clearWatchHistory = () => {
    setWatchHistory([])
    localStorage.removeItem("watch-history")
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setProfileImage(imageUrl)
        localStorage.setItem("profile-image", imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1316] text-white">
      <Sidebar />

      <main className="md:ml-16 pb-20 md:pb-8">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-bold">Profile</h1>
            <SearchBar onResultClick={handlePlay} />
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

        {/* Profile Section */}
        <div className="p-4 md:p-6">
          <Card className="bg-[#1b1f23] border-gray-700 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-4 border-orange-500">
                    {profileImage ? (
                      <Image
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-orange-500 hover:bg-orange-600"
                    onClick={() => document.getElementById("profile-upload")?.click()}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{username}</h2>
                    <Badge className="bg-orange-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium 💎
                    </Badge>
                  </div>
                  <p className="text-gray-400 mb-4">Movie enthusiast • Joined 2024</p>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{watchlist.length}</div>
                      <div className="text-sm text-gray-400">Watchlist</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{continueWatching.length}</div>
                      <div className="text-sm text-gray-400">Watching</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{watchHistory.length}</div>
                      <div className="text-sm text-gray-400">History</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">4.8</div>
                      <div className="text-sm text-gray-400">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="watchlist" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="watchlist" className="data-[state=active]:bg-orange-500">
                <Heart className="w-4 h-4 mr-2" />
                Watchlist ({watchlist.length})
              </TabsTrigger>
              <TabsTrigger value="continue" className="data-[state=active]:bg-orange-500">
                <Clock className="w-4 h-4 mr-2" />
                Continue ({continueWatching.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-orange-500">
                <History className="w-4 h-4 mr-2" />
                History ({watchHistory.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="watchlist" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">My Watchlist</h3>
                {watchlist.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setWatchlist([])
                      localStorage.removeItem("watchlist")
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>

              {watchlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {watchlist.map((item) => (
                    <div key={item.id} className="relative group">
                      <MovieCard item={item} onPlay={handlePlay} onAddToWatchlist={() => {}} />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
                        onClick={() => removeFromWatchlist(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
                  <p className="text-gray-400">Add movies and TV shows to keep track of what you want to watch</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="continue" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Continue Watching</h3>
                {continueWatching.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearContinueWatching}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>

              {continueWatching.length > 0 ? (
                <div className="space-y-4">
                  {continueWatching.map((item) => (
                    <Card key={`${item.id}-${item.season}-${item.episode}`} className="bg-[#1b1f23] border-gray-700">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={getImageUrl(item.poster_path, "w200") || "/placeholder.svg"}
                              alt={item.title}
                              width={96}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                            {item.isTV && (
                              <p className="text-gray-400 text-sm mb-2">
                                Season {item.season} • Episode {item.episode}
                              </p>
                            )}
                            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${item.progress}%` }} />
                            </div>
                            <p className="text-sm text-gray-400">{Math.round(item.progress)}% complete</p>
                          </div>
                          <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => handlePlay(item)}>
                            Continue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No shows in progress</h3>
                  <p className="text-gray-400">Start watching something to see your progress here</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Watch History</h3>
                {watchHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearWatchHistory}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>

              {watchHistory.length > 0 ? (
                <div className="space-y-4">
                  {watchHistory.map((item, index) => (
                    <Card key={`${item.id}-${index}`} className="bg-[#1b1f23] border-gray-700">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={getImageUrl(item.poster_path, "w200") || "/placeholder.svg"}
                              alt={item.title}
                              width={64}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="capitalize">{item.type}</span>
                              {item.season && item.episode && (
                                <span>
                                  S{item.season} E{item.episode}
                                </span>
                              )}
                              <span>{new Date(item.watchedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Button
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={() => {
                              const url = item.type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`
                              router.push(url)
                            }}
                          >
                            Watch Again
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No watch history</h3>
                  <p className="text-gray-400">Your recently watched movies and shows will appear here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNav />
      <BackToTop />

      <VideoPlayer isOpen={isPlayerOpen} onClose={() => setIsPlayerOpen(false)} item={selectedItem} />
    </div>
  )
}
