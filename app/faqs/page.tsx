"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { User, Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const faqs = [
  {
    id: 1,
    category: "General",
    question: "Is StreamFlix really free?",
    answer:
      "Yes! StreamFlix is completely free to use. We provide access to movies and TV shows without any subscription fees. Our service is supported by optional donations and partnerships.",
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
      "If a video isn't playing, try switching to a different server using the dropdown menu below the player. We provide multiple servers to ensure the best viewing experience.",
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
      "Yes! Click the download button in the video player to access download links. Please note that download availability depends on the selected server.",
  },
  {
    id: 6,
    category: "Technical",
    question: "Which browsers are supported?",
    answer:
      "StreamFlix works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your browser.",
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
    question: "Does StreamFlix work on mobile devices?",
    answer:
      "Yes! StreamFlix is fully responsive and works great on smartphones and tablets. You can also add it to your home screen for a native app-like experience.",
  },
]

const categories = ["All", "General", "Streaming", "Technical", "Content", "Mobile"]

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

        {/* Content */}
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <HelpCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-400">Find answers to common questions about StreamFlix</p>
          </div>

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
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
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
                              <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
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
                Can't find what you're looking for? Get in touch with our support team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Contact Support</Button>
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
