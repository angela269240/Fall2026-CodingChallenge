const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  pixabayId: {
    type: Number,
    required: true
  },

  imageUrl: {
    type: String,
    required: true
  },

  largeImageUrl: {
    type: String,
    default: ''
  },

  tags: {
    type: String,
    default: ''
  },

  user: {
    type: String,
    default: ''
  }
})

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    isShared: {
      type: Boolean,
      default: false
    },

    shareId: {
      type: String,
      default: null,
      unique: true,
      sparse: true
    },

    images: {
      type: [imageSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  'Collection',
  collectionSchema
)