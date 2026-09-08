import { useEffect, useState } from 'react'
import './App.css'

import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import ImageGrid from './components/ImageGrid'
import Collections from './components/Collections'
import SaveModal from './components/SaveModal'
import CollectionDetail from './components/CollectionDetail'

import {
  searchImages,
  type PixabayImage
} from './services/pixabay'

import {
  deleteSavedImage,
  getCollections,
  saveImageToCollection,
  updateSavedImage,
  type Collection
} from './services/api'

function App() {
  // Images returned from Pixabay
  const [images, setImages] = useState<PixabayImage[]>([])

  // Pixabay search state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Collections returned from our Express backend
  const [collections, setCollections] =
    useState<Collection[]>([])

  // Pixabay image currently selected for saving
  const [selectedImage, setSelectedImage] =
    useState<PixabayImage | null>(null)

  // ID of the collection the user is currently viewing
  const [activeCollectionId, setActiveCollectionId] =
    useState<number | null>(null)

  // Find the full collection using its ID
  const activeCollection = collections.find(
    (collection) => collection.id === activeCollectionId
  )

  // Load collections when the application first opens
  useEffect(() => {
    async function loadCollections() {
      try {
        const data = await getCollections()
        setCollections(data)
      } catch (error) {
        console.error(
          'Failed to load collections:',
          error
        )
      }
    }

    loadCollections()
  }, [])

  // Search Pixabay
  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      setError('')

      const results = await searchImages(query)

      setImages(results)
    } catch (error) {
      console.error(error)

      setError(
        'Something went wrong while searching for images.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Save a Pixabay image into one of our collections
  const handleSaveImage = async (
    collectionId: number
  ) => {
    if (!selectedImage) {
      return
    }

    try {
      const savedImage = await saveImageToCollection(
        collectionId,
        {
          pixabayId: selectedImage.id,
          imageUrl: selectedImage.webformatURL,
          largeImageUrl: selectedImage.largeImageURL,
          tags: selectedImage.tags,
          user: selectedImage.user
        }
      )

      // Update React state after the backend succeeds
      setCollections((current) =>
        current.map((collection) =>
          collection.id === collectionId
            ? {
                ...collection,
                images: [
                  ...collection.images,
                  savedImage
                ]
              }
            : collection
        )
      )

      // Close the save modal
      setSelectedImage(null)
    } catch (error) {
      console.error(
        'Failed to save image:',
        error
      )
    }
  }

  // Delete a saved image
  const handleDeleteImage = async (
    collectionId: number,
    imageId: number
  ) => {
    try {
      await deleteSavedImage(
        collectionId,
        imageId
      )

      // Remove the deleted image from React state
      setCollections((current) =>
        current.map((collection) =>
          collection.id === collectionId
            ? {
                ...collection,
                images: collection.images.filter(
                  (image) =>
                    image.id !== imageId
                )
              }
            : collection
        )
      )
    } catch (error) {
      console.error(
        'Failed to delete image:',
        error
      )
    }
  }

  // Edit a saved image
  const handleUpdateImage = async (
    collectionId: number,
    imageId: number,
    tags: string
  ) => {
    try {
      const updatedImage =
        await updateSavedImage(
          collectionId,
          imageId,
          tags
        )

      // Replace the old image with the updated one
      setCollections((current) =>
        current.map((collection) =>
          collection.id === collectionId
            ? {
                ...collection,
                images: collection.images.map(
                  (image) =>
                    image.id === imageId
                      ? updatedImage
                      : image
                )
              }
            : collection
        )
      )
    } catch (error) {
      console.error(
        'Failed to update image:',
        error
      )
    }
  }

  return (
    <>
      <Navbar />

      <main className="main-content">
        {activeCollection ? (
          // COLLECTION DETAIL VIEW
          <CollectionDetail
            collection={activeCollection}
            onBack={() =>
              setActiveCollectionId(null)
            }
            onDeleteImage={handleDeleteImage}
            onUpdateImage={handleUpdateImage}
          />
        ) : (
          // DISCOVER + COLLECTIONS VIEW
          <>
            <section className="hero">
              <h1>
                Discover something inspiring
              </h1>

              <p>
                Search for images and save your
                favorites into collections.
              </p>

              <SearchBar
                onSearch={handleSearch}
              />
            </section>

            <section className="image-section">
              <h2>Explore</h2>

              {loading && (
                <p>Loading images...</p>
              )}

              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}

              {!loading &&
                !error &&
                images.length === 0 && (
                  <p className="placeholder">
                    Search for something to
                    start discovering images.
                  </p>
                )}

              {!loading &&
                !error && (
                  <ImageGrid
                    images={images}
                    onSave={setSelectedImage}
                  />
                )}
            </section>

            <Collections
              collections={collections}
              onCollectionCreated={(
                collection
              ) =>
                setCollections(
                  (current) => [
                    ...current,
                    collection
                  ]
                )
              }
              onCollectionSelect={(
                collection
              ) =>
                setActiveCollectionId(
                  collection.id
                )
              }
            />
          </>
        )}
      </main>

      {/* Save-to-collection modal */}
      {selectedImage && (
        <SaveModal
          collections={collections}
          onSelect={handleSaveImage}
          onClose={() =>
            setSelectedImage(null)
          }
        />
      )}
    </>
  )
}

export default App