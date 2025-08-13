const TMDB_API_KEY = "7bffed716d50c95ed1c4790cfab4866a"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  genre_ids: number[]
  runtime?: number
  genres?: { id: number; name: string }[]
  imdb_id?: string
  external_ids?: {
    imdb_id: string
    facebook_id: string
    instagram_id: string
    twitter_id: string
  }
}

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  first_air_date: string
  vote_average: number
  genre_ids: number[]
  number_of_seasons?: number
  number_of_episodes?: number
  genres?: { id: number; name: string }[]
  imdb_id?: string
  external_ids?: {
    imdb_id: string
    facebook_id: string
    instagram_id: string
    twitter_id: string
  }
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string
}

const fetchWithProxy = async (url: string) => {
  try {
    // Try direct fetch first
    const response = await fetch(url)
    if (response.ok) {
      return response
    }
  } catch (error) {
    console.log("Direct fetch failed, trying proxy...")
  }

  // If direct fetch fails, use proxy
  try {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl)
    return response
  } catch (error) {
    console.error("Proxy fetch failed:", error)
    throw error
  }
}

export const tmdbApi = {
  getTrending: async (mediaType: "movie" | "tv" = "movie", timeWindow: "day" | "week" = "week", page = 1) => {
    const response = await fetchWithProxy(
      `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}&page=${page}`,
    )
    return response.json()
  },

  getPopular: async (mediaType: "movie" | "tv" = "movie", page = 1) => {
    const response = await fetchWithProxy(`${TMDB_BASE_URL}/${mediaType}/popular?api_key=${TMDB_API_KEY}&page=${page}`)
    return response.json()
  },

  getTopRated: async (mediaType: "movie" | "tv" = "movie", page = 1) => {
    const response = await fetchWithProxy(
      `${TMDB_BASE_URL}/${mediaType}/top_rated?api_key=${TMDB_API_KEY}&page=${page}`,
    )
    return response.json()
  },

  getByGenre: async (genreId: number, mediaType: "movie" | "tv" = "movie", page = 1) => {
    const response = await fetchWithProxy(
      `${TMDB_BASE_URL}/discover/${mediaType}?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`,
    )
    return response.json()
  },

  getMovieDetails: async (movieId: number) => {
    const response = await fetchWithProxy(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=external_ids,credits,videos,similar`,
    )
    const data = await response.json()

    // Ensure IMDB ID is available at the root level for easier access
    if (data.external_ids?.imdb_id) {
      data.imdb_id = data.external_ids.imdb_id
    }

    return data
  },

  getTVDetails: async (tvId: number) => {
    const response = await fetchWithProxy(
      `${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}&append_to_response=external_ids,credits,videos,similar`,
    )
    const data = await response.json()

    // Ensure IMDB ID is available at the root level for easier access
    if (data.external_ids?.imdb_id) {
      data.imdb_id = data.external_ids.imdb_id
    }

    return data
  },

  search: async (query: string) => {
    const response = await fetchWithProxy(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
    )
    return response.json()
  },

  getGenres: async (mediaType: "movie" | "tv" = "movie") => {
    const response = await fetchWithProxy(`${TMDB_BASE_URL}/genre/${mediaType}/list?api_key=${TMDB_API_KEY}`)
    return response.json()
  },

  // New method to get external IDs separately if needed
  getExternalIds: async (id: number, mediaType: "movie" | "tv" = "movie") => {
    const response = await fetchWithProxy(`${TMDB_BASE_URL}/${mediaType}/${id}/external_ids?api_key=${TMDB_API_KEY}`)
    return response.json()
  },
}

export const getImageUrl = (path: string, size: "w185" | "w300" | "w500" | "w780" | "original" = "w185") => {
  if (!path) return "/placeholder.svg?height=300&width=200"
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}
