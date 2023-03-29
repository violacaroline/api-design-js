/**
 * Mongoose model Farm.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
    minlength: 1
  },
  member: {
    type: String,
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
export const FarmModel = mongoose.model('Farm', schema)
