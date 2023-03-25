/**
 * Module for ProductRepository.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { ProductModel } from '../models/ProductModel.js'

/**
 * Encapsulates a ProductRepository.
 */
export class ProductRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {ProductModel} [model=ProductModel] - A class with the same capabilities as ProductModel.
   */
  constructor (model = ProductModel) {
    super(model)
  }
}
