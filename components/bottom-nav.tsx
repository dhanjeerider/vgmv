"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Film, Tv, Settings, HelpCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, href: "/" },
  { icon: Film, href: "/movies" },
  { icon: Tv, href: "/tv" },
  { icon: User, href: "/profile" },
  { icon: Settings, href: "/settings" },
  { icon: HelpCircle, href: "/faqs" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border md:hidden z-40">
      <div className="flex items-center justify-around py-2 px-4 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
                isActive ? "text-orange-500" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
