/**
 * Module for the ProductService.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import { MongooseServiceBase } from './MongooseServiceBase.js'
import { ProductRepository } from '../repositories/ProductRepository.js'

/**
 * Encapsulates a ProductService.
 */
export class ProductService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {ProductRepository} [repository=new ProductRepository()] - A repository instantiated from a class with the same capabilities as ProductRepository.
   */
  constructor (repository = new ProductRepository()) {
    super(repository)
  }
}
