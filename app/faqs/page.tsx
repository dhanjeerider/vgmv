"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { SearchBar } from "@/components/search-bar"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { User, Search, ChevronDown, ChevronUp, HelpCircle, Shield, Globe } from "lucide-react"
import { useRouter } from "next/navigation"

const faqs = [
  {
    id: 1,
    category: "General",
    question: "Is VegaMovies really free?",
    answer:
      "Yes! VegaMovies is completely free to use. We provide access to movies and TV shows without any subscription fees. Our service is supported by optional donations and partnerships.",
  },
  {
    id: 2,
    category: "General",
    question: "Do I need to create an account?",
    answer:
      "No account is required to watch content. However, creating a profile allows you to save your watchlist, track your viewing progress, and customize your experience.",
  },
  {
    id: 3,
    category: "Streaming",
    question: "Why isn't a video playing?",
    answer:
      "If a video isn't playing, try switching to a different server using the dropdown menu below the player. We provide multiple servers to ensure the best viewing experience. You can also try refreshing the page or clearing your browser cache.",
  },
  {
    id: 4,
    category: "Streaming",
    question: "What is Sandbox Mode?",
    answer:
      "Sandbox Mode is a security feature that blocks ads, pop-ups, and redirects while streaming. It's enabled by default for a safer viewing experience, but you can disable it if needed.",
  },
  {
    id: 5,
    category: "Streaming",
    question: "Can I download movies and TV shows?",
    answer:
      "Yes! Click the download button in the video player to access download links. Please note that download availability depends on the selected server and content availability.",
  },
  {
    id: 6,
    category: "Technical",
    question: "Which browsers are supported?",
    answer:
      "VegaMovies works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your browser.",
  },
  {
    id: 7,
    category: "Technical",
    question: "Why is the video quality poor?",
    answer:
      "Video quality depends on your internet connection and the selected server. Try switching to a different server or check your internet speed. Most of our servers support HD and 4K quality.",
  },
  {
    id: 8,
    category: "Content",
    question: "How often is new content added?",
    answer:
      "We update our content library regularly. New movies and TV show episodes are typically available within 24-48 hours of their release.",
  },
  {
    id: 9,
    category: "Content",
    question: "Can I request specific movies or shows?",
    answer:
      "While we don't take direct requests, our content is automatically updated based on popularity and availability. Use the search function to check if your desired content is available.",
  },
  {
    id: 10,
    category: "Mobile",
    question: "Does VegaMovies work on mobile devices?",
    answer:
      "Yes! VegaMovies is fully responsive and works great on smartphones and tablets. You can also add it to your home screen for a native app-like experience.",
  },
  {
    id: 11,
    category: "VPN",
    question: "Why do I need a VPN for VegaMovies?",
    answer:
      "Some ISPs (especially Jio users in India) may block access to streaming sites. A VPN helps bypass these restrictions and provides faster, more reliable access to VegaMovies content.",
  },
  {
    id: 12,
    category: "VPN",
    question: "Which VPN should I use?",
    answer:
      "We recommend using reliable VPN services like ExpressVPN, NordVPN, or Surfshark. Free VPNs like ProtonVPN or Windscribe also work well. Choose servers in countries like USA, UK, or Canada for best performance.",
  },
  {
    id: 13,
    category: "VPN",
    question: "How to set up VPN for VegaMovies?",
    answer:
      "1. Download a VPN app from your app store. 2. Create an account and choose a server location. 3. Connect to the VPN. 4. Open VegaMovies in your browser. 5. Enjoy fast, unrestricted streaming!",
  },
  {
    id: 14,
    category: "Troubleshooting",
    question: "VegaMovies is not loading, what should I do?",
    answer:
      "If VegaMovies is not loading: 1. Try using a VPN (especially for Jio users). 2. Clear your browser cache and cookies. 3. Try a different browser. 4. Check your internet connection. 5. Try accessing the site in incognito/private mode.",
  },
  {
    id: 15,
    category: "Troubleshooting",
    question: "Video keeps buffering or stops playing",
    answer:
      "For buffering issues: 1. Switch to a different server in the player. 2. Lower the video quality if available. 3. Pause the video for 30 seconds to let it buffer. 4. Check your internet speed. 5. Try using a VPN for better connection.",
  },
]

const categories = ["All", "General", "Streaming", "Technical", "Content", "Mobile", "VPN", "Troubleshooting"]

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [openItems, setOpenItems] = useState<number[]>([])
  const router = useRouter()

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#0f1316] text-white">
      <Sidebar />

      <main className="md:ml-16 pb-20 md:pb-8">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-bold">FAQs</h1>
            <SearchBar onResultClick={() => {}} />
          </div>

          <div className="flex items-center gap-2">
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

        {/* Content */}
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <HelpCircle className="w-16 h-16 text-lime-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-400">Find answers to common questions about VegaMovies</p>
          </div>

          <Card className="bg-gradient-to-r from-lime-500/10 to-green-500/10 border-lime-500/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-lime-500" />
                About VegaMovies - Your Ultimate Streaming Destination
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 leading-relaxed space-y-4">
              <p>
                <strong>VegaMovies</strong> is the premier online streaming platform offering an extensive collection of
                movies, TV shows, web series, and documentaries. Our platform provides free access to the latest
                Bollywood movies, Hollywood blockbusters, South Indian cinema, and regional content in multiple
                languages including Hindi, Tamil, Telugu, Malayalam, Punjabi, and Marathi.
              </p>
              <p>
                Watch high-quality content in HD, Full HD, and 4K resolution with multiple server options for
                uninterrupted streaming. VegaMovies features the latest movie releases, trending TV shows, classic
                films, and exclusive web series from popular OTT platforms. Our user-friendly interface makes it easy to
                discover new content with smart recommendations and advanced search filters.
              </p>
              <p>
                Experience seamless streaming with our multi-device compatibility, fast loading servers, and ad-blocking
                technology. VegaMovies supports all devices including smartphones, tablets, laptops, and smart TVs. Join
                millions of users who trust VegaMovies for their entertainment needs - no registration required,
                completely free, and always updated with the latest content.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                VPN Guide for Better Streaming Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 leading-relaxed space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lime-500 font-semibold mb-2">Why Use VPN with VegaMovies?</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Bypass ISP restrictions (especially for Jio users)</li>
                    <li>• Faster streaming speeds and reduced buffering</li>
                    <li>• Access geo-blocked content</li>
                    <li>• Enhanced privacy and security</li>
                    <li>• Stable connection for uninterrupted viewing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lime-500 font-semibold mb-2">Recommended VPN Services</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      • <strong>ExpressVPN</strong> - Premium, fastest speeds
                    </li>
                    <li>
                      • <strong>NordVPN</strong> - Great security features
                    </li>
                    <li>
                      • <strong>Surfshark</strong> - Budget-friendly option
                    </li>
                    <li>
                      • <strong>ProtonVPN</strong> - Free tier available
                    </li>
                    <li>
                      • <strong>Windscribe</strong> - Good free option
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-lime-500 font-semibold mb-2">Quick Setup Guide:</h4>
                <ol className="space-y-1 text-sm">
                  <li>1. Download and install a VPN app on your device</li>
                  <li>2. Create an account and choose a subscription plan</li>
                  <li>3. Connect to a server (USA, UK, or Canada recommended)</li>
                  <li>4. Open VegaMovies and enjoy unrestricted streaming!</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-lime-500 hover:bg-lime-600 text-black font-semibold"
                    : "border-gray-600 text-gray-300 hover:bg-gray-800"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <Card key={faq.id} className="bg-[#1b1f23] border-gray-700">
                  <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gray-800/50 transition-colors p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs bg-lime-500/20 text-lime-400 px-2 py-1 rounded">
                                {faq.category}
                              </span>
                            </div>
                            <CardTitle className="text-white text-lg">{faq.question}</CardTitle>
                          </div>
                          {openItems.includes(faq.id) ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 p-3">
                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No FAQs found</div>
                <div className="text-gray-500 text-sm">Try adjusting your search terms or category filter</div>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <Card className="bg-[#1b1f23] border-gray-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white">Still need help?</CardTitle>
              <CardDescription className="text-gray-400">
                Can't find what you're looking for? Join our Telegram channel for instant support and updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-lime-500 hover:bg-lime-600 text-black font-semibold"
                  onClick={() => window.open("https://t.me/dkmvgp", "_blank")}
                >
                  Join Telegram Support
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                  Report an Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
      <BackToTop />
    </div>
  )
}
