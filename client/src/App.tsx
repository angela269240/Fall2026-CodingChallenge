import { useEffect, useState } from 'react'
import './App.css'

import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import ImageGrid from './components/ImageGrid'
import Collections from './components/Collections'
import SaveModal from './components/SaveModal'
import CollectionDetail from './components/CollectionDetail'
import SharedCollection from './components/SharedCollection'
import Toast from './components/Toast'
import LoadingState from './components/LoadingState'

import {
  searchImages,
  type PixabayImage
} from './services/pixabay'

import {
  deleteCollection,
  deleteSavedImage,
  getCollections,
  getSharedCollection,
  saveImageToCollection,
  shareCollection,
  updateSavedImage,
  type Collection
} from './services/api'

function App() {
  // Pixabay search results
  const [images, setImages] =
    useState<PixabayImage[]>([])

  // Search state
  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  // Collections loaded from MongoDB
  const [collections, setCollections] =
    useState<Collection[]>([])

  // Image currently selected for saving
  const [selectedImage, setSelectedImage] =
    useState<PixabayImage | null>(null)

  // Collection currently being viewed
  const [activeCollectionId, setActiveCollectionId] =
    useState<string | null>(null)

  // Shared collection state
  const [sharedCollection, setSharedCollection] =
    useState<Collection | null>(null)

  const [sharedLoading, setSharedLoading] =
    useState(false)

  const [sharedError, setSharedError] =
    useState('')

  // Toast notification
  const [toastMessage, setToastMessage] =
    useState('')

  // Determine whether this is a shared collection URL
  const isSharedPage =
    window.location.pathname.startsWith('/share/')

  // Find the collection currently being viewed
  const activeCollection = collections.find(
    (collection) =>
      collection._id === activeCollectionId
  )

  // Helper for displaying temporary toast messages
  const showToast = (message: string) => {
    setToastMessage(message)

    window.setTimeout(() => {
      setToastMessage('')
    }, 3000)
  }

  // Load the owner's collections
  useEffect(() => {
    if (
      window.location.pathname.startsWith('/share/')
    ) {
      return
    }

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

  // Load a read-only shared collection
  useEffect(() => {
    const path = window.location.pathname

    if (!path.startsWith('/share/')) {
      return
    }

    const shareId =
      path.split('/share/')[1]

    async function loadSharedCollection() {
      if (!shareId) {
        setSharedError(
          'Invalid share link.'
        )

        return
      }

      try {
        setSharedLoading(true)
        setSharedError('')

        const data =
          await getSharedCollection(
            shareId
          )

        setSharedCollection(data)
      } catch (error) {
        console.error(
          'Failed to load shared collection:',
          error
        ) 

        setSharedError(
          'This shared collection could not be found.'
        )
      } finally {
        setSharedLoading(false)
      }
    }

    loadSharedCollection()
  }, [])

  // Search Pixabay
  const handleSearch = async (
    query: string
  ) => {
    try {
      setLoading(true)
      setError('')

      const results =
        await searchImages(query)

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

  // Save an image to a collection
  const handleSaveImage = async (
    collectionId: string
  ) => {
    if (!selectedImage) {
      return
    }

    try {
      const savedImage =
        await saveImageToCollection(
          collectionId,
          {
            pixabayId:
              selectedImage.id,

            imageUrl:
              selectedImage.webformatURL,

            largeImageUrl:
              selectedImage.largeImageURL,

            tags:
              selectedImage.tags,

            user:
              selectedImage.user
          }
        )

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

      setSelectedImage(null)

      showToast(
        'Image saved to collection!'
      )
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

      setCollections((current) =>
        current.map((collection) =>
          collection._id === collectionId
            ? {
                ...collection,

                images:
                  collection.images.filter(
                    (image) =>
                      image._id !== imageId
                  )
              }
            : collection
        )
      )

      showToast('Image deleted.')
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
      const updatedImage =
        await updateSavedImage(
          collectionId,
          imageId,
          tags
        )

      setCollections((current) =>
        current.map((collection) =>
          collection._id === collectionId
            ? {
                ...collection,

                images:
                  collection.images.map(
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

      showToast('Changes saved.')
    } catch (error) {
      console.error(
        'Failed to update image:',
        error
      )

      throw error
    }
  }

  // Generate and copy a shareable collection URL
  const handleShareCollection = async (
    collectionId: string
  ): Promise<void> => {
    try {
      const { shareId } =
        await shareCollection(
          collectionId
        )

      const shareUrl =
        `${window.location.origin}/share/${shareId}`

      await navigator.clipboard.writeText(
        shareUrl
      )

      setCollections((current) =>
        current.map((collection) =>
          collection._id === collectionId
            ? {
                ...collection,
                isShared: true,
                shareId
              }
            : collection
        )
      )

      showToast(
        'Share link copied to clipboard!'
      )
    } catch (error) {
      console.error(
        'Failed to share collection:',
        error
      )
    }
  }

  // Delete an entire collection
  const handleDeleteCollection = async (
    collectionId: string
  ): Promise<void> => {
    try {
      await deleteCollection(
        collectionId
      )

      setCollections((current) =>
        current.filter(
          (collection) =>
            collection._id !== collectionId
        )
      )

      // Return to the main view
      setActiveCollectionId(null)

      showToast(
        'Collection deleted.'
      )
    } catch (error) {
      console.error(
        'Failed to delete collection:',
        error
      )

      throw error
    }
  }

  return (
    <>
      <Navbar />

      <main className="main-content">
        {isSharedPage ? (
          // READ-ONLY SHARED COLLECTION
          <>
            {sharedLoading && (
              <LoadingState
                message="Loading collection..."
              />
            )}

            {sharedError && (
              <p className="error-message">
                {sharedError}
              </p>
            )}

            {!sharedLoading &&
              !sharedError &&
              sharedCollection && (
                <SharedCollection
                  collection={
                    sharedCollection
                  }
                />
              )}
          </>
        ) : activeCollection ? (
          // OWNER COLLECTION DETAIL
          <CollectionDetail
            collection={activeCollection}

            onBack={() =>
              setActiveCollectionId(null)
            }

            onDeleteImage={
              handleDeleteImage
            }

            onUpdateImage={
              handleUpdateImage
            }

            onShare={
              handleShareCollection
            }

            onDeleteCollection={
              handleDeleteCollection
            }
          />
        ) : (
          // DISCOVER + COLLECTIONS
          <>
            <section className="hero">
              <h1>
                Discover something inspiring
              </h1>

              <p>
                Search for images and save
                your favorites into
                collections.
              </p>

              <SearchBar
                onSearch={handleSearch}
                loading={loading}
              />
            </section>

            <section className="image-section">
              <h2>Explore</h2>

              {loading && (
                <LoadingState
                  message="Finding inspiration..."
                />
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
                !error &&
                images.length > 0 && (
                  <ImageGrid
                    images={images}
                    onSave={
                      setSelectedImage
                    }
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
      {!isSharedPage &&
        selectedImage && (
          <SaveModal
            collections={collections}

            onSelect={
              handleSaveImage
            }

            onClose={() =>
              setSelectedImage(null)
            }
          />
        )}

      {/* Application toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
        />
      )}
    </>
  )
}

export default App