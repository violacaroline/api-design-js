/**
 * Module for FarmRepository.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { FarmModel } from '../models/FarmModel.js'

/**
 * Encapsulates a FarmRepository.
 */
export class FarmRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {FarmModel} [model=FarmModel] - A class with the same capabilities as FarmModel.
   */
  constructor (model = FarmModel) {
    super(model)
  }
}
