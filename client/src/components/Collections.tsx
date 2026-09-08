import { useState } from 'react'

import {
  createCollection,
  type Collection
} from '../services/api'

type CollectionsProps = {
  collections: Collection[]
  onCollectionCreated: (collection: Collection) => void
  onCollectionSelect: (collection: Collection) => void
}

function Collections({
  collections,
  onCollectionCreated,
  onCollectionSelect
}: CollectionsProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    try {
      const newCollection = await createCollection(name)

      onCollectionCreated(newCollection)

      setName('')
      setError('')
    } catch {
      setError('Could not create collection.')
    }
  }

  return (
    <section className="collections-section">
      <div className="collections-header">
        <h2>My Collections</h2>

        <form
          className="collection-form"
          onSubmit={handleCreate}
        >
          <input
            type="text"
            placeholder="Collection name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <button type="submit">
            Create
          </button>
        </form>
      </div>

      {error && (
        <p className="error-message">{error}</p>
      )}

      <div className="collection-grid">
        {collections.map((collection) => (
          <article
            className="collection-card"
            key={collection.id}
            onClick={() => onCollectionSelect(collection)}
          >
            <h3>{collection.name}</h3>

            <p>
              {collection.images.length} saved images
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Collections