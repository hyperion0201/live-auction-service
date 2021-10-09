/* eslint-disable camelcase */
/* eslint-disable babel/new-cap */
import express from 'express'
import get from 'lodash/get'
import pick from 'lodash/pick'
import {RESET_PASSWORD_SECRET} from '../configs'
import {authenticate, requireStatusRole} from '../middlewares/auth'
import sendEmail from '../services/email'
import GoogleOAuth2 from '../services/google-auth'
import * as userService from '../services/user'
import {HTTP_STATUS_CODES} from '../utils/constants'
import * as enums from '../utils/constants'
import {encrypt, decrypt} from '../utils/crypto'
//import ServerError from '../utils/custom-error'
import {generateAccessToken} from '../utils/jwt'
import {verifyPasswordSync, generateResetPassword} from '../utils/password'

const DASHBOARD_URL = 'https://online-exam-2021.herokuapp.com'

const router = express.Router()

router.get('/google', (req, res, next) => {
  const googleOAuth2Client = new GoogleOAuth2()
  return res.redirect(googleOAuth2Client.generateLoginUrl())
})

router.get('/google/callback', async (req, res, next) => {
  if (req.query.error) {
    // The user did not give us permission.
    return res.redirect('/')
  }
  else {
    const googleOAuth2Client = new GoogleOAuth2()
    try {
      const tokenResponse = await googleOAuth2Client.getToken(req.query.code)
      googleOAuth2Client.setCredentials(tokenResponse)
      const response = await googleOAuth2Client.getUserInfo()

      const {email, name, verified_email} = response.data

      if (!verified_email) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
          message: 'This email is not verified by Google yet.'
        })
      }

      // since this is a Google sign-in session, the email is verified by Google itself.
      // we don't need to send a verification email.
      let user = await userService.isUserWithEmailExist(email)
      if (!user) {
        user = await userService.createUser(
          {
            email,
            role: enums.USER_ROLES.USER,
            fullname: name
          },
          {setVerified: true}
        )
      }

      // create signed jsonwebtoken and push it back.
      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email
      })

      return res.redirect(`${DASHBOARD_URL}/login-success/${accessToken}`)
    }
    catch (err) {
      res.redirect(`${DASHBOARD_URL}`)
    }
  }
})

router.post('/login', async (req, res, next) => {
  const {email = '', password = ''} = req.body
  const user = await userService.getUser({where: {email}})

  if (!user) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
      message: 'Invalid username/password.'
    })
  }

  const validPassword = verifyPasswordSync(password, user.password)
  if (!validPassword) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
      message: 'Invalid username/password.'
    })
  }

  // to-do: account is not verified

  // reject disabled / not-verified user
  if (user.status === enums.USER_STATUS.DISABLED) {
    return res.status(HTTP_STATUS_CODES.FORBIDDEN).send({
      message: 'Your account was disabled.'
    })
  }

  if (user.status === enums.USER_STATUS.NOT_VERIFIED) {
    return res.status(HTTP_STATUS_CODES.FORBIDDEN).send({
      message: 'Your account is not verified. Please check your email.'
    })
  }

  const token = generateAccessToken({
    id: user.id,
    email: user.email
  })

  res.json({
    message: 'Login success.',
    access_token: token,
    role: user.role
  })
})

router.get('/verification', async (req, res, next) => {
  const code = req.query.code
  try {
    const email = decrypt(code, RESET_PASSWORD_SECRET)
    const user = await userService.getUser({where: {email}})

    if (!user) {
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
        message: 'Link is invalid or expired.'
      })
    }

    await userService.updateUser(
      {where: {email}},
      {status: enums.USER_STATUS.VERIFIED}
    )

    return res.redirect(`${DASHBOARD_URL}/verify-success`)
  }
  catch (err) {
    return res.redirect(`${DASHBOARD_URL}/verify-error`)
  }
})

router.post('/register', async (req, res, next) => {
  const payload = req.body
  try {
    const user = await userService.createUser(payload)
    const userEmail = get(user, 'email')
    const code = encrypt(userEmail, RESET_PASSWORD_SECRET)
    const verifyUrl = `https://wiflyhomework.com/exam-api/v1/auth/verification?code=${code}`
    await sendEmail(userEmail,
      '[Basic Exam] - Verify your new account',
      `Hi.
       Please go to this link to verify your account: ${verifyUrl}
       Thanks.`
    )
    res.json(user)
  }
  catch (err) {
    next(err)
  }
})

router.post('/change-password', authenticate(), async (req, res, next) => {
  const userId = get(req, 'user.id')
  const currentHashedPass = get(req, 'user.password')
  const oldPass = get(req, 'body.oldPass')
  const newPass = get(req, 'body.newPass')

  const isPasswordCorrect = verifyPasswordSync(oldPass, currentHashedPass)
  if (!isPasswordCorrect) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
      message: 'Password not match.'
    })
  }

  try {
    await userService.updatePassword({where: {id: userId}}, newPass)

    return res.json({
      message: 'Change password successfully.'
    })
  }
  catch (err) {
    next(err)
  }
})

router.post('/reset-password', async (req, res, next) => {
  const {email} = req.body
  const user = await userService.getUser({where: {email}})

  if (!user) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
      message: 'Email not found.'
    })
  }

  const resetPassword = generateResetPassword()
  try {
    await userService.updatePassword(
      {where: {id: user.id}},
      resetPassword
    )

    await sendEmail(
      email,
      '[Basic Exam] - Password reset',
      `Hi.
     We've reset your password.
     Your new password is : ${resetPassword}.
     Please re-login.
     Thanks.
     `
    )

    res.json({message: 'Reset password successfully'})
  }
  catch (err) {
    next(err)
  }
})

router.get('/admin/all', authenticate({requiredAdmin: true}), async (req, res, next) => {
  try {
    const users = await userService.getAllUsers()

    const userRes = users.map((item) => {
      const user = {...get(item, 'dataValues')}
      delete user.password
      return user
    })

    res.json(userRes)
  }
  catch (err) {
    next(err)
  }
})

router.patch('/admin/:id',
  authenticate({requiredAdmin: true}),
  requireStatusRole(),
  async (req, res, next) => {
    const idUser = +req.params.id
    const {role, status} = get(req, 'body')

    try {
      const user = await userService.getUser({where: {id: idUser}})

      if (!user) return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({message: 'user not found'})

      await userService.updateUser({where: {id: idUser}}, {role, status})

      res.json({message: 'Update success'})
    }
    catch (err) {
      next(err)
    }
  })

router.get('/', authenticate(), async (req, res, next) => {
  const userId = get(req, 'user.id')

  try {
    const user = await userService.getUser({
      where: {id: userId}
    })

    res.json(pick(user, ['fullname', 'email', 'role']))
  }
  catch (err) {
    next(err)
  }
})

router.patch('/', authenticate(), async (req, res, next) => {
  const userId = get(req, 'user.id')
  const infoUserUpdate = get(req, 'body')

  try {
    await userService.updateUser({where: {id: userId}}, infoUserUpdate)

    res.json({message: 'Update success'})
  }
  catch (err) {
    next(err)
  }
})

export default {
  prefix: '/v1/auth',
  routerInstance: router
}
