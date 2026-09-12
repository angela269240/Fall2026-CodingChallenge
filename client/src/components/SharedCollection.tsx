import {
  Images,
  LockKeyhole
} from 'lucide-react'

import type {
  Collection
} from '../services/api'

type SharedCollectionProps = {
  collection: Collection
}

function SharedCollection({
  collection
}: SharedCollectionProps) {
  return (
    <section className="shared-collection">
      <header className="shared-header">
        <div className="shared-badge">
          <LockKeyhole size={14} />
          Read-only collection
        </div>

        <h1>
          {collection.name}
        </h1>

        <p>
          <Images size={16} />

          {collection.images.length}{' '}
          {collection.images.length === 1
            ? 'saved idea'
            : 'saved ideas'}
        </p>
      </header>

      {collection.images.length === 0 ? (
        <div className="collection-empty-state">
          <h2>
            This collection is empty
          </h2>

          <p>
            There aren't any saved ideas
            here yet.
          </p>
        </div>
      ) : (
        <div className="shared-image-grid">
          {collection.images.map(
            (image) => (
              <article
                className="shared-image-card"
                key={image._id}
              >
                <img
                  src={image.imageUrl}
                  alt={image.tags}
                  loading="lazy"
                />

                <div>
                  <h3>
                    {image.tags}
                  </h3>

                  <p>
                    by {image.user}
                  </p>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </section>
  )
}

export default SharedCollection