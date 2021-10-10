import express from 'express'
import get from 'lodash/get'
import { authenticate, requireStatusRole } from '../middlewares/auth'
import * as userService from '../services/user'
import { HTTP_STATUS_CODES } from '../utils/constants'
import * as enums from '../utils/constants'

const router = express.Router()
