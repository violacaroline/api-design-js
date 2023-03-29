/**
 * Module for the LocationController.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import createError from 'http-errors'
import { LocationService } from '../services/LocationService.js'
import { MemberService } from '../services/MemberService.js'
import { HateoasLinkBuilder } from '../util/hateoasLinkBuilder.js'

/**
 * Encapsulates a controller.
 */
export class LocationController {
  /**
   * The service.
   *
   * @type {LocationService} - The LocationService instance.
   */
  #service

  /**
   * The memberService.
   *
   * @type {MemberService} - The LocationService instance.
   */
  #memberService

  /**
   * Initializes a new instance.
   *
   * @param {LocationService} service - A service instantiated from a class with the same capabilities as LocationService.
   * @param {MemberService} memberService - A service instantiated from a class with the same capabilities as LocationService.
   */
  constructor (service = new LocationService(), memberService = new MemberService()) {
    this.#service = service
    this.#memberService = memberService
  }

  /**
   * Provide req.location to the route if :name is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} name - The value of the id for the location to load.
   */
  async loadLocation (req, res, next, name) {
    try {
      // Get the location.
      const location = await this.#service.getResourceByFilter({ cityPath: name })

      // If no location found send a 404 (Not Found).
      if (!location) {
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      // Provide the location to req.
      req.location = location

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a location.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    const location = req.location

    const halResponse = {
      _links: {
        self: HateoasLinkBuilder.getResourceByNameLink(req, location.cityPath),
        get: HateoasLinkBuilder.getBaseUrlLink(req),
        create: HateoasLinkBuilder.getCreateLink(req),
        update: HateoasLinkBuilder.getUpdateLinkByName(req, location.cityPath),
        delete: HateoasLinkBuilder.getDeleteLinkByName(req, location.cityPath),
        members: HateoasLinkBuilder.getNestedResourceByNameLink(req, location.cityPath, 'members') // NOT GOOD - HARDCODED???
      },
      _embedded: {
        location: {
          id: location.id,
          city: location.city,
          cityPath: location.cityPath,
          _links: {
            self: HateoasLinkBuilder.getResourceByNameLink(req, location.cityPath)
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
   * Sends a JSON response containing all locations.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const locations = await this.#service.get()

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getBaseUrlLink(req),
          create: HateoasLinkBuilder.getCreateLink(req)
        },
        _embedded: {
          locations: locations.map(location => ({
            id: location.id,
            city: location.city,
            cityPath: location.cityPath,
            _links: {
              self: HateoasLinkBuilder.getResourceByNameLink(req, location.cityPath),
              getByName: HateoasLinkBuilder.getResourceByNameLink(req, location.cityPath),
              create: HateoasLinkBuilder.getCreateLink(req),
              update: HateoasLinkBuilder.getUpdateLinkByName(req, location.cityPath),
              delete: HateoasLinkBuilder.getDeleteLinkByName(req, location.cityPath),
              members: HateoasLinkBuilder.getNestedResourceByNameLink(req, location.cityPath, 'members')
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
   * Sends a JSON response containing a specific location's members.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findMembersByLocation (req, res, next) {
    try {
      const location = {
        location: req.params.name
      }
      const locationUrlName = req.params.name

      const membersOfLocation = await this.#memberService.getAllResourcesByFilter(location)

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getNestedResourceByNameLink(req, locationUrlName, 'members'),
          create: HateoasLinkBuilder.getCreateLink(req)
        },
        _embedded: {
          members: membersOfLocation.map(member => ({
            id: member.id,
            name: member.name,
            location: member.location,
            _links: {
              self: HateoasLinkBuilder.getNestedResourceByIdLink(req, locationUrlName, 'members', member.id)
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
   * Creates a new location.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const { city } = req.body
      const cityPath = city.toLowerCase().replaceAll(' ', '-')

      const newLocation = await this.#service.insert({ city, cityPath })

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getResourceByNameLink(req, newLocation.cityPath),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getByName: HateoasLinkBuilder.getResourceByNameLink(req, newLocation.cityPath),
          update: HateoasLinkBuilder.getUpdateLinkByName(req, newLocation.cityPath),
          delete: HateoasLinkBuilder.getDeleteLinkByName(req, newLocation.cityPath)
        },
        _embedded: {
          location: {
            id: newLocation.id,
            city: newLocation.city,
            cityPath: newLocation.cityPath,
            _links: {
              self: HateoasLinkBuilder.getResourceByNameLink(req, newLocation.cityPath)
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
   * Completely updates a specific location.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const { city } = req.body

      await this.#service.replaceByName({ cityPath: req.params.name }, { city })

      const updatedLocation = await this.#service.getResourceByFilter({ cityPath: req.params.name })

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getUpdateLinkByName(req, updatedLocation.cityPath),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getByName: HateoasLinkBuilder.getResourceByNameLink(req, updatedLocation.cityPath),
          create: HateoasLinkBuilder.getCreateLink(req),
          delete: HateoasLinkBuilder.getDeleteLinkByName(req, updatedLocation.cityPath)
        },
        _embedded: {
          location: {
            id: updatedLocation.id,
            city: updatedLocation.city,
            _links: {
              self: HateoasLinkBuilder.getResourceByNameLink(req, updatedLocation.cityPath)
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
   * Deletes the specified location.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      const deletedLocation = req.params.name
      await this.#service.deleteByName({ cityPath: deletedLocation })

      const halResponse = {
        _links: {
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          create: HateoasLinkBuilder.getCreateLink(req)
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
