import mongoose from 'mongoose'

const schema = mongoose.Schema(
  {
    rawDescription: String,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  },
  {
    timestamp: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
)

export default mongoose.model('ProductDescription', schema)
