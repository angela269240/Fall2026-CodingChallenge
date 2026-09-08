import type { Collection } from '../services/api'

type SaveModalProps = {
  collections: Collection[]
  onSelect: (collectionId: string) => void
  onClose: () => void
}

function SaveModal({
  collections,
  onSelect,
  onClose
}: SaveModalProps) {
  return (
    <div className="modal-overlay">
      <div className="save-modal">
        <div className="modal-header">
          <h2>Save to collection</h2>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {collections.length === 0 ? (
          <p>
            Create a collection before saving images.
          </p>
        ) : (
          <div className="collection-options">
            {collections.map((collection) => (
              <button
                key={collection._id}
                onClick={() => onSelect(collection._id)}
              >
                <span>{collection.name}</span>

                <span>
                  {collection.images.length} images
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SaveModal