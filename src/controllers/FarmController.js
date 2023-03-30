/**
 * Module for the FarmController.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import createError from 'http-errors'
import { FarmService } from '../services/FarmService.js'
import { HateoasLinkBuilder } from '../util/HateoasLinkBuilder.js'

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

    const halResponse = {
      _links: {
        self: HateoasLinkBuilder.getNestedResourceByIdLink(req, req.member.id, 'farms', farm.id),
        get: HateoasLinkBuilder.getNestedResourceLink(req, req.member.id, 'farms'),
        getById: HateoasLinkBuilder.getNestedResourceByIdLink(req, req.member.id, 'farms', farm.id),
        create: HateoasLinkBuilder.getNestedResourceCreateLink(req, req.member.id, 'farms'),
        update: HateoasLinkBuilder.getNestedResourceUpdateLink(req, req.member.id, 'farms', farm.id),
        delete: HateoasLinkBuilder.getNestedResourceDeleteLink(req, req.member.id, 'farms', farm.id),
        products: HateoasLinkBuilder.getDoubleNestedResourceLink(req, req.member.id, 'farms', farm.id, 'products')
      },
      _embedded: {
        farm: {
          id: farm.id,
          name: farm.name,
          member: farm.member,
          _links: {
            self: HateoasLinkBuilder.getNestedResourceByIdLink(req, req.member.id, 'farms', farm.id)
          }
        }
      }
    }

    res
      .json(halResponse)
      .status(200)
      .end()
  }

  /**
   * Sends a JSON response containing a specific location's members.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findFarmsByMember (req, res, next) {
    try {
      const member = {
        member: req.params.id
      }
      const memberId = req.params.id

      const farmsOfMember = await this.#service.getAllResourcesByFilter(member)

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getNestedResourceLink(req, memberId, 'farms'),
          create: HateoasLinkBuilder.getNestedResourceCreateLink(req, req.member.id, 'farms')
        },
        _embedded: {
          farms: farmsOfMember.map(farm => ({
            id: farm.id,
            name: farm.name,
            member: farm.member,
            _links: {
              self: HateoasLinkBuilder.getNestedResourceByIdLink(req, req.member.id, 'farms', farm.id),
              get: HateoasLinkBuilder.getNestedResourceLink(req, req.member.id, 'farms'),
              getById: HateoasLinkBuilder.getNestedResourceByIdLink(req, req.member.id, 'farms', farm.id),
              update: HateoasLinkBuilder.getNestedResourceUpdateLink(req, req.member.id, 'farms', farm.id),
              delete: HateoasLinkBuilder.getNestedResourceDeleteLink(req, req.member.id, 'farms', farm.id),
              products: HateoasLinkBuilder.getDoubleNestedResourceLink(req, req.member.id, 'farms', farm.id, 'products')
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
        member: req.member.id
      })

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getNestedResourceCreateLink(req, req.member.id, 'farms'),
          get: HateoasLinkBuilder.getNestedResourceLink(req, req.member.id, 'farms'),
          getById: HateoasLinkBuilder.getNestedResourceByIdLink(req, req.member.id, 'farms', newFarm.id),
          update: HateoasLinkBuilder.getNestedResourceUpdateLink(req, req.member.id, 'farms', newFarm.id),
          delete: HateoasLinkBuilder.getNestedResourceDeleteLink(req, req.member.id, 'farms', newFarm.id)
        },
        _embedded: {
          farm: {
            id: newFarm.id,
            name: newFarm.name,
            member: newFarm.member,
            _links: {
              self: HateoasLinkBuilder.getNestedResourceByIdLink(req, req.member.id, 'farms', newFarm.id)
            }
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
      const { name, member } = req.body

      await this.#service.replace(req.params.farmId, { name, member })

      const updatedFarm = await this.#service.getById(req.params.farmId)

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getNestedResourceByIdLink(req, req.member.id, 'farms', updatedFarm.id),
          get: HateoasLinkBuilder.getNestedResourceLink(req, req.member.id, 'farms'),
          getById: HateoasLinkBuilder.getNestedResourceByIdLink(req, req.member.id, 'farms', updatedFarm.id),
          create: HateoasLinkBuilder.getNestedResourceCreateLink(req, req.member.id, 'farms'),
          update: HateoasLinkBuilder.getNestedResourceUpdateLink(req, req.member.id, 'farms', updatedFarm.id),
          delete: HateoasLinkBuilder.getNestedResourceDeleteLink(req, req.member.id, 'farms', updatedFarm.id)
        },
        _embedded: {
          farm: {
            id: updatedFarm.id,
            name: updatedFarm.name,
            member: updatedFarm.member,
            _links: {
              self: HateoasLinkBuilder.getNestedResourceByIdLink(req, req.member.id, 'farms', updatedFarm.id)
            }
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
   * Deletes the specified farm.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      const deletedFarmId = req.params.farmId

      await this.#service.delete(deletedFarmId)

      const halResponse = {
        _links: {
          get: HateoasLinkBuilder.getNestedResourceLink(req, req.member.id, 'farms'),
          create: HateoasLinkBuilder.getNestedResourceCreateLink(req, req.member.id, 'farms')
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
