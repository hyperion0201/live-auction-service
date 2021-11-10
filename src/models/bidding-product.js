import mongoose from 'mongoose'

const schema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  status: {
    type: String,
    enum: ['SOLD', 'AVAILABLE', 'EXPIRED'],
    default: 'AVAILABLE'
  },
  allowBuyNow: Boolean,
  stepPrice: Number,
  initPrice: Number,
  buyNowPrice: Number,
  currentPrice: Number,
  publicTime: Date,
  endTime: Date,
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bannedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamp: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

export default mongoose.model('BiddingProduct', schema)
