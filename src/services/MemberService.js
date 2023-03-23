/**
 * Module for the MemberService.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import { MongooseServiceBase } from './MongooseServiceBase.js'
import { MemberRepository } from '../repositories/MemberRepository.js'

/**
 * Encapsulates a Member service.
 */
export class MemberService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {MemberRepository} [repository=new MemberRepository()] - A repository instantiated from a class with the same capabilities as MemberRepository.
   */
  constructor (repository = new MemberRepository()) {
    super(repository)
  }
}
