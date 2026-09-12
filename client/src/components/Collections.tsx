import { useState } from 'react'
import { Plus } from 'lucide-react'

import {
  createCollection,
  type Collection
} from '../services/api'

type CollectionsProps = {
  collections: Collection[]

  onCollectionCreated: (
    collection: Collection
  ) => void

  onCollectionSelect: (
    collection: Collection
  ) => void
}

function Collections({
  collections,
  onCollectionCreated,
  onCollectionSelect
}: CollectionsProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleCreate = async (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    try {
      const newCollection =
        await createCollection(name)

      onCollectionCreated(newCollection)

      setName('')
      setError('')
    } catch {
      setError(
        'Could not create collection.'
      )
    }
  }

  return (
    <section
      className="collections-section"
      id="collections"
    >
      <div className="collections-header">
        <div>
          <h2>My Collections</h2>

          <p>
            Keep the things you love organized.
          </p>
        </div>

        <form
          className="collection-form"
          onSubmit={handleCreate}
        >
          <input
            type="text"
            placeholder="New collection..."
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />

          <button type="submit">
            <Plus size={17} />
            Create
          </button>
        </form>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {collections.length === 0 ? (
        <div className="empty-collections">
          <h3>No collections yet</h3>

          <p>
            Create your first collection
            and start saving inspiration.
          </p>
        </div>
      ) : (
        <div className="collection-grid">
          {collections.map((collection) => {
            const previewImages =
              collection.images.slice(0, 3)

            return (
              <button
                className="collection-card"
                key={collection._id}
                onClick={() =>
                  onCollectionSelect(collection)
                }
              >
                <div className="collection-preview">
                  {previewImages.length === 0 ? (
                    <div className="empty-preview">
                      <span>
                        No saves yet
                      </span>
                    </div>
                  ) : (
                    previewImages.map(
                      (image, index) => (
                        <img
                          key={image._id}
                          src={image.imageUrl}
                          alt=""
                          className={
                            `preview-image preview-${index + 1}`
                          }
                          loading="lazy"
                        />
                      )
                    )
                  )}
                </div>

                <div className="collection-info">
                  <h3>
                    {collection.name}
                  </h3>

                  <p>
                    {collection.images.length}{' '}
                    {collection.images.length === 1
                      ? 'save'
                      : 'saves'}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Collections