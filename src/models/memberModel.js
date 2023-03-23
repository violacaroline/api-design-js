/**
 * Mongoose model Member.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// Create a schema.
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 2
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Salts and hashes password before save.
schema.pre('save', async function () {
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
 * Authorizes a member. True if member has access token in Authorization header.
 *
 * @param {*} req - Express request object.
 * @param {*} res - Express response object.
 * @param {*} next - Next function call.
 * @returns {boolean} - Authorize user true/false.
 */
schema.statics.authorize = async function (req, res, next) {
  return req.header.authorization
}

// Create a model using the schema.
export const MemberModel = mongoose.model('Member', schema)
