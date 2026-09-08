const express = require('express')

const {
  getCollections,
  createCollection,
  addImageToCollection,
  updateImage,
  deleteImage
} = require('../controllers/collectionController')

const router = express.Router()

router.get('/', getCollections)
router.post('/', createCollection)
router.post('/:id/images', addImageToCollection)
router.patch(
  '/:collectionId/images/:imageId',
  updateImage
)

router.delete(
  '/:collectionId/images/:imageId',
  deleteImage
)

module.exports = router