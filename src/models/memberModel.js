/**
 * Mongoose model Member.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import validator from 'validator'

const { isEmail } = validator

// Create a schema.
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
    minlength: 2
  },
  location: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  phone: {
    type: String,
    required: [true, 'Phone is required.'],
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email address is required.'],
    trim: true,
    minlength: 2,
    validate: [isEmail, 'Please provide a valid email address.']
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [8, 'The password should be 8 characters minimum']
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Salts and hashes password before save.
schema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }

  this.password = await bcrypt.hash(this.password, 10)
})

const convertOptions = {
  virtuals: true,
  versionKey: false,
  /**
   * Performs a transformation of the resulting object to remove sensitive information.
   *
   * @param {object} doc - The mongoose document which is being converted.
   * @param {object} ret - The plain object representation which has been converted.
   */
  transform: (doc, ret) => {
    delete ret._id
  }
}

schema.set('timestamps', true)
schema.set('toObject', convertOptions)
schema.set('toJSON', convertOptions)

/**
 * Authenticates a member.
 *
 * @param {string} email - ...
 * @param {string} password - ...
 * @returns {Promise<MemberModel>} ...
 */
schema.statics.authenticate = async function (email, password) {
  const member = await this.findOne({ email })

  // If no member found or password is wrong, throw an error.
  if (!(await bcrypt.compare(password, member?.password))) {
    const error = new Error('Invalid credentials.')
    error.statusCode = 401
    throw error
  }

  // Member found and password correct, return the member.
  return member
}

/**
 * Authenticates jwts.
 *
 * If authentication is successful, `req.member`is populated and the
 * request is authorized to continue.
 * If authentication fails, an unauthorized response will be sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
schema.statics.authenticateJWT = (req, res, next) => {
  try {
    const [authenticationScheme, token] = req.headers.authorization?.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme.')
    }

    const publicKey = Buffer.from(process.env.ACCESS_TOKEN_SECRET_PUBLIC, 'base64')

    const payload = jwt.verify(token, publicKey)
    req.member = {
      id: payload.sub,
      name: payload.name,
      email: payload.email
    }

    next()
  } catch (err) {
    const error = createError(401)
    error.cause = err
    next(error)
  }
}

// Create a model using the schema.
export const MemberModel = mongoose.model('Member', schema)
