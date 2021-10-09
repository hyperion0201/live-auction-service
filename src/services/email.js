import debug from 'debug'
import nodemailer from 'nodemailer'
import {EMAIL_PASSWORD, EMAIL_USERNAME} from '../configs'
import ServerError from '../utils/custom-error'

const ns = 'send-mail'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD
  }
})

async function send(to, subject, content) {
  debug.log(ns, `Sending email with subject ${subject} to ${to}...`)
  try {
    await transporter.sendMail({
      from: EMAIL_USERNAME,
      to,
      subject,
      text: content
    })
    debug.log(ns, `Sending to ${to}: OK.`)
  }
  catch (err) {
    throw new ServerError({
      name: 'Something error when send email.',
      err
    })
  }
}

export default send
