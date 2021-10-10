import mongoose from 'mongoose'

const schema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  currentPrice: Number,
  publicTime: Number,
  endTime: Number
})

export default mongoose.model('BiddingProduct', schema)
