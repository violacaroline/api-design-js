/**
 * Module for the WebHookService.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import { MongooseServiceBase } from './MongooseServiceBase.js'
import { WebHookRepository } from '../repositories/WebHookRepository.js'

/**
 * Encapsulates a WebHookService.
 */
export class WebHookService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {WebHookRepository} [repository=new WebHookRepository()] - A repository instantiated from a class with the same capabilities as WebHookRepository.
   */
  constructor (repository = new WebHookRepository()) {
    super(repository)
  }
}
