/**
 * Module for MemberRepository.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { MemberModel } from '../models/MemberModel.js'

/**
 * Encapsulates a Member repository.
 */
export class MemberRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {MemberModel} [model=MemberModel] - A class with the same capabilities as MemberModel.
   */
  constructor (model = MemberModel) {
    super(model)
  }
}
