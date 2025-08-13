"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Film, Tv, Settings, HelpCircle, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Film, label: "Movies", href: "/movies" },
  { icon: Tv, label: "TV Shows", href: "/tv" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "FAQs", href: "/faqs" },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      {/* Mobile Menu Button - Fixed position */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-background border-r border-border z-50 transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">StreamFlix</span>
          </div>

          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent",
                    isActive && "bg-orange-500 text-white hover:bg-orange-600",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-16 bg-background border-r border-border z-40 hidden md:flex flex-col items-center py-6 space-y-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-12 h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent",
                  isActive && "bg-orange-500 text-white hover:bg-orange-600",
                )}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </Button>
            </Link>
          )
        })}
      </aside>
    </>
  )
}
