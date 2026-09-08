import type { PixabayImage } from '../services/pixabay'

type ImageCardProps = {
  image: PixabayImage
  onSave: (image: PixabayImage) => void
}

function ImageCard({image,onSave}: ImageCardProps) {
  return (
    <article className="image-card">
      <img
        src={image.webformatURL}
        alt={image.tags}
      />

      <div className="image-info">
        <p>{image.tags}</p>
        <span>by {image.user}</span>

        <button onClick={() => onSave(image)}>Save</button>
      </div>
    </article>
  )
}

export default ImageCard