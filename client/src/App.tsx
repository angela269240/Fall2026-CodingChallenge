import { useState } from 'react'
import './App.css'

import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import ImageGrid from './components/ImageGrid'

import {
  searchImages,
  type PixabayImage,
} from './services/pixabay'

function App() {
  const [images, setImages] = useState<PixabayImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      setError('')

      const results = await searchImages(query)

      setImages(results)
    } catch (error) {
      console.error(error)
      setError('Something went wrong while searching for images.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="main-content">
        <section className="hero">
          <h1>Discover something inspiring</h1>

          <p>
            Search for images and save your favorites
            into collections.
          </p>

          <SearchBar onSearch={handleSearch} />
        </section>

        <section className="image-section">
          <h2>Explore</h2>

          {loading && <p>Loading images...</p>}

          {error && <p className="error-message">{error}</p>}

          {!loading && !error && images.length === 0 && (
            <p className="placeholder">
              Search for something to start discovering images.
            </p>
          )}

          {!loading && !error && (
            <ImageGrid images={images} />
          )}
        </section>
      </main>
    </>
  )
}

export default App