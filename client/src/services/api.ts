const API_URL = 'http://localhost:3000/api'

export type SavedImage = {
  _id: string
  pixabayId: number
  imageUrl: string
  largeImageUrl: string
  tags: string
  user: string
}

export type Collection = {
  _id: string
  name: string
  images: SavedImage[]
}

export async function getCollections(): Promise<Collection[]> {
  const response = await fetch(
    `${API_URL}/collections`
  )

  if (!response.ok) {
    throw new Error(
      'Failed to load collections'
    )
  }

  return response.json()
}

export async function createCollection(
  name: string
): Promise<Collection> {
  const response = await fetch(
    `${API_URL}/collections`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ name })
    }
  )

  if (!response.ok) {
    throw new Error(
      'Failed to create collection'
    )
  }

  return response.json()
}

export async function saveImageToCollection(
  collectionId: string,
  image: {
    pixabayId: number
    imageUrl: string
    largeImageUrl: string
    tags: string
    user: string
  }
): Promise<SavedImage> {
  const response = await fetch(
    `${API_URL}/collections/${collectionId}/images`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(image)
    }
  )

  if (!response.ok) {
    throw new Error(
      'Failed to save image'
    )
  }

  return response.json()
}

export async function updateSavedImage(
  collectionId: string,
  imageId: string,
  tags: string
): Promise<SavedImage> {
  const response = await fetch(
    `${API_URL}/collections/${collectionId}/images/${imageId}`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ tags })
    }
  )

  if (!response.ok) {
    throw new Error(
      'Failed to update image'
    )
  }

  return response.json()
}

export async function deleteSavedImage(
  collectionId: string,
  imageId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/collections/${collectionId}/images/${imageId}`,
    {
      method: 'DELETE'
    }
  )

  if (!response.ok) {
    throw new Error(
      'Failed to delete image'
    )
  }
}