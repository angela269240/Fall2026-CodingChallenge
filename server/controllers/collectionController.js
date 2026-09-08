let collections = []
let nextId = 1

function getCollections(req, res) {
  res.json(collections)
}

function createCollection(req, res) {
  const { name } = req.body

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: 'Collection name is required'
    })
  }

  const collection = {
    id: nextId++,
    name: name.trim(),
    images: []
  }

  collections.push(collection)

  res.status(201).json(collection)
}

function addImageToCollection(req, res) {
  const collectionId = Number(req.params.id)
  const collection = collections.find(
    (collection) => collection.id === collectionId
  )

  if (!collection) {
    return res.status(404).json({
      message: 'Collection not found'
    })
  }

  const {
    pixabayId,
    imageUrl,
    largeImageUrl,
    tags,
    user
  } = req.body

  if (!pixabayId || !imageUrl) {
    return res.status(400).json({
      message: 'Image information is required'
    })
  }

  const savedImage = {
    id: pixabayId,
    imageUrl,
    largeImageUrl,
    tags,
    user
  }

  collection.images.push(savedImage)

  res.status(201).json(savedImage)
}

function updateImage(req, res) {
  const collectionId = Number(req.params.collectionId)
  const imageId = Number(req.params.imageId)

  const collection = collections.find(
    (collection) => collection.id === collectionId
  )

  if (!collection) {
    return res.status(404).json({
      message: 'Collection not found'
    })
  }

  const image = collection.images.find(
    (image) => image.id === imageId
  )

  if (!image) {
    return res.status(404).json({
      message: 'Image not found'
    })
  }

  const { tags } = req.body

  if (!tags || !tags.trim()) {
    return res.status(400).json({
      message: 'Image title is required'
    })
  }

  image.tags = tags.trim()

  res.json(image)
}

function deleteImage(req, res) {
  const collectionId = Number(req.params.collectionId)
  const imageId = Number(req.params.imageId)

  const collection = collections.find(
    (collection) => collection.id === collectionId
  )

  if (!collection) {
    return res.status(404).json({
      message: 'Collection not found'
    })
  }

  const imageIndex = collection.images.findIndex(
    (image) => image.id === imageId
  )

  if (imageIndex === -1) {
    return res.status(404).json({
      message: 'Image not found'
    })
  }

  collection.images.splice(imageIndex, 1)

  res.status(204).send()
}

module.exports = {
  getCollections,
  createCollection,
  addImageToCollection,
  updateImage,
  deleteImage
}