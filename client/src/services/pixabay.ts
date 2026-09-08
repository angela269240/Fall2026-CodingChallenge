const API_URL = 'https://pixabay.com/api/'
const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY

export type PixabayImage = {
  id: number
  webformatURL: string
  largeImageURL: string
  tags: string
  user: string
}

type PixabayResponse = {
  hits: PixabayImage[]
}

export async function searchImages(
  query: string
): Promise<PixabayImage[]> {
  const url =
    `${API_URL}?key=${API_KEY}` +
    `&q=${encodeURIComponent(query)}` +
    `&image_type=photo&per_page=24`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch images')
  }

  const data: PixabayResponse = await response.json()

  return data.hits
}