/**
 * Module for the ProductController.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import createError from 'http-errors'
import { ProductService } from '../services/ProductService.js'
import { HateoasLinkBuilder } from '../util/hateoasLinkBuilder.js'

/**
 * Encapsulates a controller.
 */
export class ProductController {
  /**
   * The service.
   *
   * @type {ProductService} - The ProductService instance.
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {ProductService} service - A service instantiated from a class with the same capabilities as ProductService.
   */
  constructor (service = new ProductService()) {
    this.#service = service
  }

  /**
   * Provide req.product to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the product to load.
   */
  async loadProduct (req, res, next, id) {
    try {
      // Get the product.
      const product = await this.#service.getById(id)

      // If no product found send a 404 (Not Found).
      if (!product) {
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      // Provide the product to req.
      req.product = product

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    const product = req.product

    /* SHOULD I REALLY USE ._id - OR ID? WHAT IS THE REASON FOR UNDERSCORE? */

    const halResponse = {
      _links: {
        self: HateoasLinkBuilder.getResourceByIdLink(req, product._id, product.name),
        get: HateoasLinkBuilder.getBaseUrlLink(req),
        update: HateoasLinkBuilder.getUpdateLink(req, product._id, product.name),
        delete: HateoasLinkBuilder.getDeleteLink(req, product._id, product.name)
      },
      _embedded: {
        product: {
          _links: {
            self: HateoasLinkBuilder.getPlainResourceLink(req, product._id)
          },
          id: product.id,
          name: product.name,
          producer: product.producer,
          price: product.price,
          soldout: product.soldout
        }
      }
    }

    res
      .json(halResponse)
      .status(200)
      .end()
  }

  /**
   * Sends a JSON response containing all products.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const products = await this.#service.get()

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getBaseUrlLink(req),
          create: HateoasLinkBuilder.getCreateLink(req, 'product')
        },
        _embedded: {
          products: products.map(product => ({
            id: product.id,
            name: product.name,
            _links: {
              self: HateoasLinkBuilder.getPlainResourceLink(req, product.id),
              getById: HateoasLinkBuilder.getResourceByIdLink(req, product.id, product.name),
              update: HateoasLinkBuilder.getUpdateLink(req, product.id, product.name),
              delete: HateoasLinkBuilder.getDeleteLink(req, product.id, product.name)
            }
          }))
        }
      }
      res
        .json(halResponse)
        .status(200)
        .end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const newProduct = await this.#service.insert({
        name: req.body.name,
        producer: req.body.producer,
        price: req.body.price,
        soldout: req.body.soldout
      })

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, newProduct._id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceByIdLink(req, newProduct._id, newProduct.name),
          update: HateoasLinkBuilder.getUpdateLink(req, newProduct._id, newProduct.name),
          delete: HateoasLinkBuilder.getDeleteLink(req, newProduct._id, newProduct.name)
        },
        _embedded: {
          product: {
            _links: {
              self: HateoasLinkBuilder.getPlainResourceLink(req, newProduct._id)
            },
            id: newProduct.id,
            name: newProduct.name,
            producer: newProduct.producer,
            price: newProduct.price,
            soldout: newProduct.soldout
          }
        }
      }

      res
        .status(201)
        .json(halResponse)
        .end()
    } catch (error) {
      const err = createError(error.name === 'ValidationError'
        ? 400 // Bad format
        : 500 // Something went really wrong
      )
      err.cause = error

      next(error)
    }
  }

  /**
   * Completely updates a specific product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const { name, producer, price, soldout } = req.body

      await this.#service.replace(req.params.id, { name, producer, price, soldout })

      const updatedProduct = await this.#service.getById(req.params.id)

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, updatedProduct._id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceByIdLink(req, updatedProduct._id, updatedProduct.name),
          create: HateoasLinkBuilder.getCreateLink(req),
          delete: HateoasLinkBuilder.getDeleteLink(req, updatedProduct._id, updatedProduct.name)
        },
        _embedded: {
          product: {
            _links: {
              self: HateoasLinkBuilder.getPlainResourceLink(req, updatedProduct._id)
            },
            id: updatedProduct.id,
            name: updatedProduct.name,
            producer: updatedProduct.producer,
            price: updatedProduct.price,
            soldout: updatedProduct.soldout
          }
        }
      }

      res
        .status(200)
        .json(halResponse)
        .end()
    } catch (error) {
      const err = createError(error.name === 'ValidationError'
        ? 400 // Bad format
        : 500 // Something went really wrong
      )
      err.cause = error

      next(err)
    }
  }

  /**
   * Deletes the specified product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      const deletedProductId = req.params.id
      await this.#service.delete(deletedProductId)

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, deletedProductId._id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceByIdLink(req, deletedProductId._id, deletedProductId.name),
          create: HateoasLinkBuilder.getCreateLink(req)
        },
        _embedded: {
          product: deletedProductId
        }
      }

      res
        .status(204)
        .json(halResponse)
        .end()
    } catch (error) {
      next(error)
    }
  }
}
