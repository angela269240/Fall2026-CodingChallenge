import { useState } from 'react'

import {
  ArrowLeft,
  Check,
  Pencil,
  Share2,
  Trash2,
  X
} from 'lucide-react'

import type {
  Collection,
  SavedImage
} from '../services/api'

type CollectionDetailProps = {
  collection: Collection

  onBack: () => void

  onDeleteImage: (
    collectionId: string,
    imageId: string
  ) => void

  onUpdateImage: (
    collectionId: string,
    imageId: string,
    tags: string
  ) => Promise<void>

  onShare: (
    collectionId: string
  ) => Promise<void>

  onDeleteCollection: (
    collectionId: string
  ) => Promise<void>
}

function CollectionDetail({
  collection,
  onBack,
  onDeleteImage,
  onUpdateImage,
  onShare,
  onDeleteCollection
}: CollectionDetailProps) {
  const [editingImage, setEditingImage] =
    useState<SavedImage | null>(null)

  const [editText, setEditText] =
    useState('')

  const [saving, setSaving] =
    useState(false)

  const [deletingCollection, setDeletingCollection] =
    useState(false)

  const startEditing = (
    image: SavedImage
  ) => {
    setEditingImage(image)
    setEditText(image.tags)
  }

  const cancelEditing = () => {
    setEditingImage(null)
    setEditText('')
  }

  const saveEdit = async () => {
    if (
      !editingImage ||
      !editText.trim() ||
      saving
    ) {
      return
    }

    try {
      setSaving(true)

      await onUpdateImage(
        collection._id,
        editingImage._id,
        editText
      )

      setEditingImage(null)
      setEditText('')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCollection = async () => {
    if (deletingCollection) {
      return
    }

    try {
      setDeletingCollection(true)

      await onDeleteCollection(
        collection._id
      )
    } finally {
      setDeletingCollection(false)
    }
  }

  return (
    <section className="collection-detail">
      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        All collections
      </button>

      <div className="collection-detail-header">
        <div>
          <h1>
            {collection.name}
          </h1>

          <p>
            {collection.images.length}{' '}
            {collection.images.length === 1
              ? 'saved idea'
              : 'saved ideas'}
          </p>
        </div>

        <div className="collection-header-actions">
          <button
            type="button"
            className="share-button"
            onClick={() =>
              onShare(collection._id)
            }
          >
            <Share2 size={17} />
            Share
          </button>

          <button
            type="button"
            className="delete-collection-button"
            onClick={
              handleDeleteCollection
            }
            disabled={
              deletingCollection
            }
          >
            <Trash2 size={17} />

            {deletingCollection
              ? 'Deleting...'
              : 'Delete Collection'}
          </button>
        </div>
      </div>

      {collection.images.length === 0 ? (
        <div className="collection-empty-state">
          <h2>
            Nothing saved here yet
          </h2>

          <p>
            Head back to Discover and save
            something that inspires you.
          </p>
        </div>
      ) : (
        <div className="saved-image-grid">
          {collection.images.map(
            (image) => {
              const isEditing =
                editingImage?._id ===
                image._id

              return (
                <article
                  className="saved-image-card"
                  key={image._id}
                >
                  <div className="saved-image-wrapper">
                    <img
                      src={image.imageUrl}
                      alt={image.tags}
                      loading="lazy"
                    />
                  </div>

                  <div className="saved-image-info">
                    {isEditing ? (
                      <div className="edit-image-form">
                        <label
                          htmlFor={
                            `edit-${image._id}`
                          }
                        >
                          Edit title
                        </label>

                        <input
                          id={
                            `edit-${image._id}`
                          }
                          value={editText}
                          onChange={(event) =>
                            setEditText(
                              event.target.value
                            )
                          }
                          onKeyDown={(event) => {
                            if (
                              event.key ===
                              'Enter'
                            ) {
                              saveEdit()
                            }

                            if (
                              event.key ===
                              'Escape'
                            ) {
                              cancelEditing()
                            }
                          }}
                          autoFocus
                        />

                        <div className="edit-actions">
                          <button
                            type="button"
                            className="confirm-edit-button"
                            onClick={saveEdit}
                            disabled={saving}
                          >
                            <Check size={16} />

                            {saving
                              ? 'Saving...'
                              : 'Save'}
                          </button>

                          <button
                            type="button"
                            className="cancel-edit-button"
                            onClick={
                              cancelEditing
                            }
                            disabled={saving}
                          >
                            <X size={16} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="saved-image-text">
                          <h3>
                            {image.tags}
                          </h3>

                          <p>
                            by {image.user}
                          </p>
                        </div>

                        <div className="image-actions">
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              startEditing(
                                image
                              )
                            }
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              onDeleteImage(
                                collection._id,
                                image._id
                              )
                            }
                            aria-label={
                              `Delete ${image.tags}`
                            }
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              )
            }
          )}
        </div>
      )}
    </section>
  )
}

export default CollectionDetail