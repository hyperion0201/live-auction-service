import mongoose from 'mongoose'

const schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  biddingPrice: Number
})

export default mongoose.model('BiddingRecord', schema)
