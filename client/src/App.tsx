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
  // Images returned by Pixabay
  const [images, setImages] = useState<PixabayImage[]>([])

  // Search state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Collections loaded from MongoDB through our Express API
  const [collections, setCollections] =
    useState<Collection[]>([])

  // Pixabay image currently selected for saving
  const [selectedImage, setSelectedImage] =
    useState<PixabayImage | null>(null)

  // MongoDB _id of the collection currently being viewed
  const [activeCollectionId, setActiveCollectionId] =
    useState<string | null>(null)

  // Find the active collection using its MongoDB _id
  const activeCollection = collections.find(
    (collection) =>
      collection._id === activeCollectionId
  )

  // Load collections from Express/MongoDB when the app starts
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

  // Save a Pixabay image into a collection
  const handleSaveImage = async (
    collectionId: string
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

      // Immediately update React state after MongoDB succeeds
      setCollections((current) =>
        current.map((collection) =>
          collection._id === collectionId
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

  // Delete an image from a collection
  const handleDeleteImage = async (
    collectionId: string,
    imageId: string
  ) => {
    try {
      await deleteSavedImage(
        collectionId,
        imageId
      )

      // Immediately remove the deleted image from React state
      setCollections((current) =>
        current.map((collection) =>
          collection._id === collectionId
            ? {
                ...collection,
                images: collection.images.filter(
                  (image) =>
                    image._id !== imageId
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
    collectionId: string,
    imageId: string,
    tags: string
  ): Promise<void> => {
    try {
      const updatedImage = await updateSavedImage(
        collectionId,
        imageId,
        tags
      )

      // Immediately update the edited image in React state
      setCollections((current) =>
        current.map((collection) =>
          collection._id === collectionId
            ? {
                ...collection,
                images: collection.images.map(
                  (image) =>
                    image._id === imageId
                      ? {
                          ...image,
                          ...updatedImage
                        }
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

      throw error
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
                    Search for something to start
                    discovering images.
                  </p>
                )}

              {!loading &&
                !error &&
                images.length > 0 && (
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
                  collection._id
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