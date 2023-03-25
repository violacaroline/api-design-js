/**
 * Module for LocationRepository.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { LocationModel } from '../models/LocationModel.js'

/**
 * Encapsulates a LocationRepository.
 */
export class LocationRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {LocationModel} [model=LocationModel] - A class with the same capabilities as LocationModel.
   */
  constructor (model = LocationModel) {
    super(model)
  }
}
