import mongoose from 'mongoose'
import {USER_ROLES, USER_STATUS} from '../utils/constants'

const schema = mongoose.Schema({
  email: String,
  username: String,
  fullName: String,
  password: String,
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.USER
  },
  status: {
    type: String,
    enum: Object.values(USER_STATUS),
    default: USER_STATUS.NOT_VERIFIED
  }
})

export default mongoose.model('User', schema)
