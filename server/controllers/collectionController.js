const Collection = require('../models/Collection')

// Get all collections
async function getCollections(req, res) {
  try {
    const collections = await Collection.find().sort({
      createdAt: -1
    })

    res.json(collections)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to load collections'
    })
  }
}

// Create a collection
async function createCollection(req, res) {
  try {
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Collection name is required'
      })
    }

    const collection = await Collection.create({
      name: name.trim()
    })

    res.status(201).json(collection)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to create collection'
    })
  }
}

// Save an image to a collection
async function addImageToCollection(req, res) {
  try {
    const collection = await Collection.findById(
      req.params.id
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

    collection.images.push({
      pixabayId,
      imageUrl,
      largeImageUrl,
      tags,
      user
    })

    await collection.save()

    // Return the image Mongoose just created
    const savedImage =
      collection.images[collection.images.length - 1]

    res.status(201).json(savedImage)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to save image'
    })
  }
}

// Edit a saved image
async function updateImage(req, res) {
  try {
    const collection = await Collection.findById(
      req.params.collectionId
    )

    if (!collection) {
      return res.status(404).json({
        message: 'Collection not found'
      })
    }

    const image = collection.images.id(
      req.params.imageId
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

    await collection.save()

    res.json(image)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to update image'
    })
  }
}

// Delete a saved image
async function deleteImage(req, res) {
  try {
    const collection = await Collection.findById(
      req.params.collectionId
    )

    if (!collection) {
      return res.status(404).json({
        message: 'Collection not found'
      })
    }

    const image = collection.images.id(
      req.params.imageId
    )

    if (!image) {
      return res.status(404).json({
        message: 'Image not found'
      })
    }

    image.deleteOne()

    await collection.save()

    res.status(204).send()
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to delete image'
    })
  }
}

module.exports = {
  getCollections,
  createCollection,
  addImageToCollection,
  updateImage,
  deleteImage
}