import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VegaMovies - Watch Latest Bollywood & Hollywood Movies Online Free | HD Streaming",
  description:
    "Watch thousands of latest Bollywood and Hollywood movies online for free in HD quality. Stream new releases, popular series, and classic films without subscription. Download movies in 480p, 720p, 1080p quality. Best free movie streaming site.",
  keywords:
    "vegamovies, vega movies, free movies download, bollywood movies, hollywood movies, watch online, TV shows, streaming, HD movies, free streaming, online cinema, watch series, movie download, 480p movies, 720p movies, 1080p movies, latest movies 2024, Vegamovies",
  authors: [{ name: "VegaMovies" }],
  creator: "VegaMovies",
  publisher: "VegaMovies",
  applicationName: "Vegamovies",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.vegamoviesog.shop"),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "VegaMovies - Watch Latest Movies Online Free",
    description: "Stream thousands of Bollywood and Hollywood movies for free in HD quality. No subscription required.",
    url: "https://www.vegamoviesog.shop",
    siteName: "VegaMovies",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VegaMovies - Free Movie Streaming",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VegaMovies - Watch Latest Movies Online Free",
    description: "Stream thousands of Bollywood and Hollywood movies for free in HD quality. No subscription required.",
    images: ["/twitter-image.jpg"],
    creator: "@vegamovies",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vegamovies",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Vegamovies",
    "application-name": "Vegamovies",
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://dktczn.github.io/Dk/cdn/autoupdate.js"></script>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Vegamovies" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "VegaMovies",
              alternateName: "Vegamovies",
              description: "Watch thousands of latest Bollywood and Hollywood movies online for free in HD quality",
              url: "https://www.vegamoviesog.shop",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.vegamoviesog.shop/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "VegaMovies",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.vegamoviesog.shop/logo.png",
                },
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: "Free Movie Streaming - VegaMovies",
              description: "Stream latest Bollywood and Hollywood movies for free in HD quality",
              thumbnailUrl: "https://www.vegamoviesog.shop/thumbnail.jpg",
              uploadDate: "2024-01-01",
              contentUrl: "https://www.vegamoviesog.shop",
              embedUrl: "https://www.vegamoviesog.shop",
            }),
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                window.deferredPrompt = deferredPrompt;
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
