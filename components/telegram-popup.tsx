"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, X } from "lucide-react"

export function TelegramPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Show popup after 2 seconds on first visit
    const hasSeenPopup = localStorage.getItem("telegram-popup-seen")
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem("telegram-popup-seen", "true")
  }

  const handleJoinTelegram = () => {
    window.open("https://t.me/dkmvgp", "_blank")
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Important Notice
           
          </DialogTitle>
          <div className="text-muted-foreground text-sm text-left space-y-3">
            <p>
              If this website is not loading, please use any VPN because it will not load on Jio user's phones without
              VPN.
            </p>
            <p>Join our Telegram channel for latest movie updates and direct download links!</p>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Button onClick={handleJoinTelegram} className="bg-blue-500 hover:bg-blue-600 text-white">
            <ExternalLink className="w-4 h-4 mr-2" />
            Join Telegram Channel
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Continue to Website
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
