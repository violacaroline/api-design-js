/**
 * Module for the FarmService.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import { MongooseServiceBase } from './MongooseServiceBase.js'
import { FarmRepository } from '../repositories/FarmRepository.js'

/**
 * Encapsulates a FarmService.
 */
export class FarmService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {FarmRepository} [repository=new FarmRepository()] - A repository instantiated from a class with the same capabilities as FarmRepository.
   */
  constructor (repository = new FarmRepository()) {
    super(repository)
  }
}
