"use client"

import { useState } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NoticeBox() {
  const [isVisible, setIsVisible] = useState(true)

  const handleDownloadApp = () => {
    // Trigger PWA install prompt
    if ("serviceWorker" in navigator) {
      // Check if app is already installed
      if (window.matchMedia("(display-mode: standalone)").matches) {
        alert("App is already installed!")
        return
      }

      // For browsers that support beforeinstallprompt
      const deferredPrompt = (window as any).deferredPrompt
      if (deferredPrompt) {
        deferredPrompt.prompt()
        deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt")
          }
          ;(window as any).deferredPrompt = null
        })
      } else {
        // Fallback for iOS and other browsers
        alert('To install the app:\n\n1. Tap the share button\n2. Select "Add to Home Screen"\n3. Tap "Add"')
      }
    }
  }

  const handleJoinTelegram = () => {
    window.open("https://t.me/dkmvgp", "_blank")
  }

  if (!isVisible) return null

  return (
    <div className="relative mx-4 md:mx-6 mb-8 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 via-lime-500 to-green-600 p-[2px] rounded-xl">
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-xl">
          <div className="p-6 md:p-8 text-center">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent mb-3">
                  Welcome to VegaMovies - Your Ultimate Entertainment Hub
                </h3>
                <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-4xl mx-auto">
                  Stream the latest movies and TV shows in HD quality. Enjoy Hollywood blockbusters, Bollywood hits,
                  regional cinema, and international content. Our vast library includes new releases, trending series,
                  classic films, and exclusive web series across all genres.
                </p>
                 <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-4xl mx-auto">
                  Note : - we didn't store any file on our server bicouse we dont have server we are using third party api and server and you can face ads on player owned by third party sites
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    onClick={handleJoinTelegram}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 min-w-[200px]"
                  >
                    📱 Join Telegram Channel
                  </Button>
                  <Button
                    onClick={handleDownloadApp}
                    className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 min-w-[200px]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download App
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3 justify-center mt-6 text-sm">
                  <span className="bg-gradient-to-r from-lime-400/20 to-green-500/20 border border-lime-400/30 text-lime-400 px-3 py-1 rounded-full">
                    Free Streaming
                  </span>
                  <span className="bg-gradient-to-r from-lime-400/20 to-green-500/20 border border-lime-400/30 text-lime-400 px-3 py-1 rounded-full">
                    HD Quality
                  </span>
                  <span className="bg-gradient-to-r from-lime-400/20 to-green-500/20 border border-lime-400/30 text-lime-400 px-3 py-1 rounded-full">
                    Latest Movies
                  </span>
                  <span className="bg-gradient-to-r from-lime-400/20 to-green-500/20 border border-lime-400/30 text-lime-400 px-3 py-1 rounded-full">
                    TV Shows
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 absolute top-4 right-4"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
