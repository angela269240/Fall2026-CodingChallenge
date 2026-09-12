import { Bookmark } from 'lucide-react'

import type { PixabayImage } from '../services/pixabay'

type ImageCardProps = {
  image: PixabayImage
  onSave: (image: PixabayImage) => void
}

function ImageCard({
  image,
  onSave
}: ImageCardProps) {
  const handleSave = () => {
    onSave(image)
  }

  return (
    <article className="image-card">
      <div className="image-wrapper">
        <img
          src={image.webformatURL}
          alt={image.tags}
          loading="lazy"
        />

        <div className="image-overlay">
          <button
            type="button"
            className="save-image-button"
            onClick={handleSave}
          >
            <Bookmark size={17} />
            Save
          </button>
        </div>
      </div>

      <div className="image-meta">
        <p>{image.tags}</p>
        <span>by {image.user}</span>
      </div>
    </article>
  )
}

export default ImageCard