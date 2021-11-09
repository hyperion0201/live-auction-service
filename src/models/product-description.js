import mongoose from 'mongoose'

const schema = mongoose.Schema(
  {
    rawDescription: String,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  },
  {timestamp: true}
)

export default mongoose.model('ProductDescription', schema)
