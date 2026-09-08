import { useState } from 'react'

import type {
  Collection,
  SavedImage
} from '../services/api'

type CollectionDetailProps = {
  collection: Collection

  onBack: () => void

  onDeleteImage: (
    collectionId: number,
    imageId: number
  ) => void

  onUpdateImage: (
    collectionId: number,
    imageId: number,
    tags: string
  ) => void
}

function CollectionDetail({
  collection,
  onBack,
  onDeleteImage,
  onUpdateImage
}: CollectionDetailProps) {
  const [editingImage, setEditingImage] =
    useState<SavedImage | null>(null)

  const [editText, setEditText] = useState('')

  const startEditing = (image: SavedImage) => {
    setEditingImage(image)
    setEditText(image.tags)
  }

  const saveEdit = () => {
    if (!editingImage || !editText.trim()) {
      return
    }

    onUpdateImage(
      collection.id,
      editingImage.id,
      editText
    )

    setEditingImage(null)
    setEditText('')
  }

  return (
    <section className="collection-detail">
      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to collections
      </button>

      <div className="collection-detail-header">
        <div>
          <h2>{collection.name}</h2>

          <p>
            {collection.images.length} saved images
          </p>
        </div>
      </div>

      {collection.images.length === 0 ? (
        <p className="placeholder">
          This collection is empty.
        </p>
      ) : (
        <div className="saved-image-grid">
          {collection.images.map((image) => (
            <article
              className="saved-image-card"
              key={image.id}
            >
              <img
                src={image.imageUrl}
                alt={image.tags}
              />

              <div className="saved-image-info">
                {editingImage?.id === image.id ? (
                  <>
                    <input
                      value={editText}
                      onChange={(event) =>
                        setEditText(event.target.value)
                      }
                    />

                    <div className="image-actions">
                      <button onClick={saveEdit}>
                        Save Changes
                      </button>

                      <button
                        onClick={() =>
                          setEditingImage(null)
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>{image.tags}</h3>

                    <p>by {image.user}</p>

                    <div className="image-actions">
                      <button
                        onClick={() =>
                          startEditing(image)
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          onDeleteImage(
                            collection.id,
                            image.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default CollectionDetail