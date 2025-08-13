"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { servers } from "@/lib/servers"
import { User, Save, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserSettings {
  theme: "light" | "dark"
  defaultServer: string
  autoplay: boolean
  sandboxMode: boolean
  language: string
  quality: string
  subtitles: boolean
  notifications: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    theme: "dark",
    defaultServer: servers[0].name,
    autoplay: true,
    sandboxMode: true,
    language: "en",
    quality: "auto",
    subtitles: false,
    notifications: true,
  })

  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("user-settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }
  }, [])

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem("user-settings", JSON.stringify(settings))

      // Apply theme immediately
      if (settings.theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }

      // Simulate save delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const resetSettings = () => {
    const defaultSettings: UserSettings = {
      theme: "dark",
      defaultServer: servers[0].name,
      autoplay: true,
      sandboxMode: true,
      language: "en",
      quality: "auto",
      subtitles: false,
      notifications: true,
    }
    setSettings(defaultSettings)
  }

  return (
    <div className="min-h-screen bg-[#0f1316] text-white">
      <Sidebar />

      <main className="md:ml-16 pb-20 md:pb-8">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-bold">Settings</h1>
            <SearchBar onResultClick={() => {}} />
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

        {/* Settings Content */}
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
          {/* Appearance */}
          <Card className="bg-[#1b1f23] border-gray-700">
            <CardHeader className="p-3">
              <CardTitle className="text-white">Appearance</CardTitle>
              <CardDescription className="text-gray-400">
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Theme</Label>
                  <p className="text-sm text-gray-400">Choose between light and dark mode</p>
                </div>
                <Select
                  value={settings.theme}
                  onValueChange={(value: "light" | "dark") => updateSetting("theme", value)}
                >
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Language</Label>
                  <p className="text-sm text-gray-400">Select your preferred language</p>
                </div>
                <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Playback */}
          <Card className="bg-[#1b1f23] border-gray-700">
            <CardHeader className="p-3">
              <CardTitle className="text-white">Playback</CardTitle>
              <CardDescription className="text-gray-400">Configure video playback preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Default Server</Label>
                  <p className="text-sm text-gray-400">Choose your preferred streaming server</p>
                </div>
                <Select value={settings.defaultServer} onValueChange={(value) => updateSetting("defaultServer", value)}>
                  <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {servers.slice(0, 10).map((server) => (
                      <SelectItem key={server.name} value={server.name}>
                        {server.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Video Quality</Label>
                  <p className="text-sm text-gray-400">Select default video quality</p>
                </div>
                <Select value={settings.quality} onValueChange={(value) => updateSetting("quality", value)}>
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="480p">480p</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Autoplay</Label>
                  <p className="text-sm text-gray-400">Automatically start playing videos</p>
                </div>
                <Switch checked={settings.autoplay} onCheckedChange={(checked) => updateSetting("autoplay", checked)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Subtitles</Label>
                  <p className="text-sm text-gray-400">Enable subtitles by default</p>
                </div>
                <Switch
                  checked={settings.subtitles}
                  onCheckedChange={(checked) => updateSetting("subtitles", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-[#1b1f23] border-gray-700">
            <CardHeader className="p-3">
              <CardTitle className="text-white">Security & Privacy</CardTitle>
              <CardDescription className="text-gray-400">Manage security and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Sandbox Mode</Label>
                  <p className="text-sm text-gray-400">Block ads and redirects for safer browsing</p>
                </div>
                <Switch
                  checked={settings.sandboxMode}
                  onCheckedChange={(checked) => updateSetting("sandboxMode", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Notifications</Label>
                  <p className="text-sm text-gray-400">Receive notifications about new content</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSetting("notifications", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>

            <Button onClick={saveSettings} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
      <BackToTop />
    </div>
  )
}
