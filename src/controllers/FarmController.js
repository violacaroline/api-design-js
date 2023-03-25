/**
 * Module for the FarmController.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import createError from 'http-errors'
import { FarmService } from '../services/FarmService.js'
import { HateoasLinkBuilder } from '../util/hateoasLinkBuilder.js'

/**
 * Encapsulates a controller.
 */
export class FarmController {
  /**
   * The service.
   *
   * @type {FarmService} - The FarmService instance.
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {FarmService} service - A service instantiated from a class with the same capabilities as FarmService.
   */
  constructor (service = new FarmService()) {
    this.#service = service
  }

  /**
   * Provide req.farm to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the farm to load.
   */
  async loadFarm (req, res, next, id) {
    try {
      // Get the farm.
      const farm = await this.#service.getById(id)

      // If no farm found send a 404 (Not Found).
      if (!farm) {
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      // Provide the farm to req.
      req.farm = farm

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a farm.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    const farm = req.farm

    /* SHOULD I REALLY USE ._id - OR ID? WHAT IS THE REASON FOR UNDERSCORE? */

    const halResponse = {
      _links: {
        self: HateoasLinkBuilder.getResourceLink(req, farm._id, farm.name),
        get: HateoasLinkBuilder.getBaseUrlLink(req),
        update: HateoasLinkBuilder.getUpdateLink(req, farm._id, farm.name),
        delete: HateoasLinkBuilder.getDeleteLink(req, farm._id, farm.name),
        products: HateoasLinkBuilder.getNextResourceLink(req, farm._id, farm.name, '/products') // NOT GOOD - HARDCODED
      },
      _embedded: {
        farm: {
          _links: {
            self: HateoasLinkBuilder.getPlainResourceLink(req, farm._id)
          },
          id: farm.id,
          name: farm.name
        }
      }
    }

    res
      .json(halResponse)
      .status(200)
      .end()
  }

  /**
   * Sends a JSON response containing all farms.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const farms = await this.#service.get()

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getBaseUrlLink(req),
          create: HateoasLinkBuilder.getCreateLink(req, 'farm')
        },
        _embedded: {
          farms: farms.map(farm => ({
            id: farm.id,
            name: farm.name,
            _links: {
              self: HateoasLinkBuilder.getPlainResourceLink(req, farm.id),
              getById: HateoasLinkBuilder.getResourceLink(req, farm.id, farm.name),
              update: HateoasLinkBuilder.getUpdateLink(req, farm.id, farm.name),
              delete: HateoasLinkBuilder.getDeleteLink(req, farm.id, farm.name),
              products: HateoasLinkBuilder.getNextResourceLink(req, farm.id, farm.name, '/products')
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
   * Creates a new farm.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const newFarm = await this.#service.insert({
        name: req.body.name,
        member: req.body.member
      })

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, newFarm._id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceLink(req, newFarm._id, newFarm.name),
          update: HateoasLinkBuilder.getUpdateLink(req, newFarm._id, newFarm.name),
          delete: HateoasLinkBuilder.getDeleteLink(req, newFarm._id, newFarm.name)
        },
        _embedded: {
          farm: {
            _links: {
              self: HateoasLinkBuilder.getPlainResourceLink(req, newFarm._id)
            },
            id: newFarm.id,
            name: newFarm.name
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
   * Completely updates a specific farm.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const { name, owner } = req.body

      await this.#service.replace(req.params.id, { name, owner })

      const updatedFarm = await this.#service.getById(req.params.id)

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, updatedFarm._id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceLink(req, updatedFarm._id, updatedFarm.name),
          create: HateoasLinkBuilder.getCreateLink(req),
          delete: HateoasLinkBuilder.getDeleteLink(req, updatedFarm._id, updatedFarm.name)
        },
        _embedded: {
          farm: {
            _links: {
              self: HateoasLinkBuilder.getPlainResourceLink(req, updatedFarm._id)
            },
            id: updatedFarm.id,
            name: updatedFarm.name
          }
        }
      }

      res
        .status(204)
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
   * Deletes the specified farm.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      const deletedFarmId = req.params.id
      await this.#service.delete(deletedFarmId)

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, deletedFarmId._id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceLink(req, deletedFarmId._id, deletedFarmId.name),
          create: HateoasLinkBuilder.getCreateLink(req)
        },
        _embedded: {
          farm: deletedFarmId
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
