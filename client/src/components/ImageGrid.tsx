import ImageCard from './ImageCard'
import type { PixabayImage } from '../services/pixabay'

type ImageGridProps = {
  images: PixabayImage[]
  onSave: (image: PixabayImage) => void
}

function ImageGrid({images, onSave}: ImageGridProps) {
  return (
    <div className="image-grid">
      {images.map((image) => (
        <ImageCard 
        key={image.id}
        image={image}
        onSave={onSave}
        />
      ))}
    </div>
  )
}

export default ImageGrid