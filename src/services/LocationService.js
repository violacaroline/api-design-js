/**
 * Module for the LocationService.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import { MongooseServiceBase } from './MongooseServiceBase.js'
import { LocationRepository } from '../repositories/LocationRepository.js'

/**
 * Encapsulates a location service.
 */
export class LocationService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {LocationRepository} [repository=new LocationRepository()] - A repository instantiated from a class with the same capabilities as LocationRepository.
   */
  constructor (repository = new LocationRepository()) {
    super(repository)
  }
}
