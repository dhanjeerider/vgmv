"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { servers, buildStreamUrl, type Server } from "@/lib/servers"
import { tmdbApi } from "@/lib/tmdb"
import type { Movie, TVShow } from "@/lib/tmdb"

interface VideoPlayerProps {
  isOpen: boolean
  onClose: () => void
  item: Movie | TVShow | null
  season?: number
  episode?: number
}

export function VideoPlayer({ isOpen, onClose, item, season, episode }: VideoPlayerProps) {
  const [selectedServer, setSelectedServer] = useState<Server>(servers[0])
  const [sandboxEnabled, setSandboxEnabled] = useState(true)
  const [currentSeason, setCurrentSeason] = useState(season || 1)
  const [currentEpisode, setCurrentEpisode] = useState(episode || 1)
  const [streamUrl, setStreamUrl] = useState("")
  const [imdbId, setImdbId] = useState<string>("")

  const isTV = item && "name" in item
  const title = item ? ("title" in item ? item.title : item.name) : ""

  useEffect(() => {
    if (!item) return

    const fetchExternalIds = async () => {
      try {
        if (!item.imdb_id && !item.external_ids?.imdb_id) {
          const externalIds = await tmdbApi.getExternalIds(item.id, isTV ? "tv" : "movie")
          if (externalIds.imdb_id) {
            setImdbId(externalIds.imdb_id)
          }
        } else {
          setImdbId(item.imdb_id || item.external_ids?.imdb_id || "")
        }
      } catch (error) {
        console.error("Error fetching external IDs:", error)
      }
    }

    fetchExternalIds()
  }, [item, isTV])

  useEffect(() => {
    if (!item) return

    const tmdbId = item.id
    const currentImdbId = imdbId || item.imdb_id || item.external_ids?.imdb_id || ""

    const url = buildStreamUrl(selectedServer, tmdbId, currentImdbId, currentSeason, currentEpisode, isTV)
    setStreamUrl(url)
  }, [item, selectedServer, currentSeason, currentEpisode, isTV, imdbId])

  const handleServerChange = (serverName: string) => {
    const server = servers.find((s) => s.name === serverName)
    if (server) {
      setSelectedServer(server)
      localStorage.setItem("preferred-server", serverName)
    }
  }

  const openInPopup = () => {
    if (streamUrl) {
      window.open(streamUrl, "_blank", "width=1200,height=800,scrollbars=yes,resizable=yes")
    }
  }

  const handleDownload = () => {
    if (!item) return

    const tmdbId = item.id
    const currentImdbId = imdbId || item.imdb_id || item.external_ids?.imdb_id || ""

    let downloadUrl = ""

    if (isTV) {
      // For TV shows: use IMDb ID if available, otherwise TMDB ID
      if (currentImdbId) {
        downloadUrl = `https://dl.vidsrc.vip/tv/${currentImdbId}/${currentSeason}/${currentEpisode}`
      } else {
        downloadUrl = `https://dl.vidsrc.vip/tv/${tmdbId}/${currentSeason}/${currentEpisode}`
      }
    } else {
      // For movies: use IMDb ID if available, otherwise TMDB ID
      if (currentImdbId) {
        downloadUrl = `https://dl.vidsrc.vip/movie/${currentImdbId}`
      } else {
        downloadUrl = `https://dl.vidsrc.vip/movie/${tmdbId}`
      }
    }

    window.open(downloadUrl, "_blank")
  }

  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-h-[95vh] bg-card border-border p-0">
        <DialogHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-around">
            <DialogTitle className="text-card-foreground text-lg">{title}</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="text-muted-foreground hover:text-foreground bg-lime-500/10 hover:bg-lime-500/20"
                title="Download movie/episode"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={openInPopup}
                className="text-muted-foreground hover:text-foreground"
                title="Open in popup (no ads)"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            {streamUrl ? (
              <iframe
                src={streamUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                sandbox={sandboxEnabled ? "allow-scripts allow-same-origin allow-forms" : undefined}
                referrerPolicy="no-referrer"
                title={`${title} - ${selectedServer.name}`}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                <div className="text-center">
                  <div className="text-lg mb-2">Loading...</div>
                  <div className="text-sm text-gray-400">Preparing video stream</div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 space-y-4 bg-card">
            {/* TV Show Controls */}
            {isTV && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-card-foreground text-sm mb-2 block">Season</Label>
                  <Select
                    value={currentSeason.toString()}
                    onValueChange={(value) => setCurrentSeason(Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((season) => (
                        <SelectItem key={season} value={season.toString()}>
                          Season {season}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-card-foreground text-sm mb-2 block">Episode</Label>
                  <Select
                    value={currentEpisode.toString()}
                    onValueChange={(value) => setCurrentEpisode(Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => i + 1).map((episode) => (
                        <SelectItem key={episode} value={episode.toString()}>
                          Episode {episode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Server Selection */}
            <div>
              <Label className="text-card-foreground text-sm mb-2 block">Server</Label>
              <Select value={selectedServer.name} onValueChange={handleServerChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {servers.map((server) => (
                    <SelectItem key={server.name} value={server.name}>
                      <div className="flex items-center gap-2">
                        <span>{server.name}</span>
                        {server.name.includes("4K") && (
                          <Badge variant="secondary" className="text-xs">
                            4K
                          </Badge>
                        )}
                        {server.name.includes("fast") && (
                          <Badge variant="secondary" className="text-xs bg-green-600">
                            Fast
                          </Badge>
                        )}
                        {server.name.includes("low ads") && (
                          <Badge variant="secondary" className="text-xs bg-blue-600">
                            Low Ads
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Currently playing from: <span className="text-lime-500">{selectedServer.name}</span>
              </p>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch id="sandbox" checked={sandboxEnabled} onCheckedChange={setSandboxEnabled} />
                <Label htmlFor="sandbox" className="text-card-foreground text-sm">
                  Sandbox Mode (Blocks ads & redirects)
                </Label>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
