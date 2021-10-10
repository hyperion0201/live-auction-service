import mongoose from 'mongoose'

const schema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  currentPrice: Number,
  publicTime: Date,
  endTime: Date
})

export default mongoose.model('BiddingProduct', schema)
