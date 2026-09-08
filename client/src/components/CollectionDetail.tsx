import { useState } from 'react'

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

  const saveEdit = async () => {
  if (!editingImage || !editText.trim()) {
    return
  }

  await onUpdateImage(
    collection._id,
    editingImage._id,
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
              key={image._id}
            >
              <img
                src={image.imageUrl}
                alt={image.tags}
              />

              <div className="saved-image-info">
                {editingImage?._id === image._id ? (
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
                            collection._id,
                            image._id
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