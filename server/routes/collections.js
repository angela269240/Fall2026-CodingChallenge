const express = require('express')

const {
  getCollections,
  createCollection,
  addImageToCollection,
  updateImage,
  deleteImage,
  shareCollection,
  getSharedCollection,
  deleteCollection
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

router.post(
  '/:id/share',
  shareCollection
)

router.get(
  '/shared/:shareId',
  getSharedCollection
)

router.delete('/:id', deleteCollection)

module.exports = router