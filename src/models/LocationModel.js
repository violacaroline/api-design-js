/**
 * Mongoose model Location.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  city: {
    type: String,
    unique: true,
    required: [true, 'City is required.'],
    trim: true,
    minlength: 1
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    minlength: 1
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
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

// Create a model using the schema.
export const LocationModel = mongoose.model('Location', schema)
