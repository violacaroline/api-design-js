/**
 * Module for WebHookRepository.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { WebHookModel } from '../models/WebHookModel.js'

/**
 * Encapsulates a WebHookRepository.
 */
export class WebHookRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {WebHookModel} [model=WebHookModel] - A class with the same capabilities as WebHookModel.
   */
  constructor (model = WebHookModel) {
    super(model)
  }
}
