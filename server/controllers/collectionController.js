const Collection = require('../models/Collection')
const { randomUUID } = require('crypto')
const {
  getImageById
} = require('../services/pixabayService')

// Get all collections
async function getCollections(req, res) {
  try {
    const collections =
      await Collection.find().sort({
        createdAt: -1
      })

    const refreshedCollections =
      await Promise.all(
        collections.map(async (collection) => {
          await Promise.all(
            collection.images.map(async (image) => {
              try {
                const pixabayImage =
                  await getImageById(
                    image.pixabayId
                  )

                if (pixabayImage) {
                  image.imageUrl =
                    pixabayImage.webformatURL

                  image.largeImageUrl =
                    pixabayImage.largeImageURL
                }
              } catch (error) {
                console.error(
                  `Failed to refresh image ${image.pixabayId}:`,
                  error.message
                )
              }
            })
          )

          return collection
        })
      )

    res.json(refreshedCollections)
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

async function shareCollection(req, res) {
  try {
    const collection = await Collection.findById(
      req.params.id
    )

    if (!collection) {
      return res.status(404).json({
        message: 'Collection not found'
      })
    }

    if (!collection.shareId) {
      collection.shareId = randomUUID()
    }

    collection.isShared = true

    await collection.save()

    res.json({
      shareId: collection.shareId
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to share collection'
    })
  }
}

async function getSharedCollection(req, res) {
  try {
    const collection = await Collection.findOne({
      shareId: req.params.shareId,
      isShared: true
    })

    if (!collection) {
      return res.status(404).json({
        message: 'Shared collection not found'
      })
    }
    await Promise.all(
      collection.images.map(async (image) => {
        try {
          const pixabayImage =
            await getImageById(
            image.pixabayId
          )

          if (pixabayImage) {
            image.imageUrl =
              pixabayImage.webformatURL

            image.largeImageUrl =
              pixabayImage.largeImageURL
          }
        } catch (error) {
          console.error(
            `Failed to refresh image ${image.pixabayId}:`,
            error.message
          )
        }
      })
    )
    res.json(collection)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to load shared collection'
    })
  }
}

async function deleteCollection(req, res) {
  try {
    const collection = await Collection.findByIdAndDelete(
      req.params.id
    )

    if (!collection) {
      return res.status(404).json({
        message: 'Collection not found'
      })
    }

    res.status(204).send()
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to delete collection'
    })
  }
}

module.exports = {
  getCollections,
  createCollection,
  addImageToCollection,
  updateImage,
  deleteImage,
  shareCollection,
  getSharedCollection,
  deleteCollection
}