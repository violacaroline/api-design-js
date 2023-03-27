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
   * Provide req.location to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the location to load.
   */
  async loadLocation (req, res, next, id) {
    try {
      // Get the location.
      const location = await this.#service.getById(id)

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

    /* SHOULD I REALLY USE ._id - OR ID? WHAT IS THE REASON FOR UNDERSCORE? */

    const halResponse = {
      _links: {
        self: HateoasLinkBuilder.getResourceByIdLink(req, location._id, location.city),
        get: HateoasLinkBuilder.getBaseUrlLink(req),
        update: HateoasLinkBuilder.getUpdateLink(req, location._id, location.city),
        delete: HateoasLinkBuilder.getDeleteLink(req, location._id, location.city),
        members: HateoasLinkBuilder.getNestedResourceLink(req, location._id, location.city, 'members') // NOT GOOD - HARDCODED
      },
      _embedded: {
        location
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
          create: HateoasLinkBuilder.getCreateLink(req, 'location')
        },
        _embedded: {
          locations: locations.map(location => ({
            id: location.id,
            city: location.city,
            _links: {
              self: HateoasLinkBuilder.getPlainResourceLink(req, location.id),
              getById: HateoasLinkBuilder.getResourceByIdLink(req, location.id, location.city),
              update: HateoasLinkBuilder.getUpdateLink(req, location.id, location.city),
              delete: HateoasLinkBuilder.getDeleteLink(req, location.id, location.city),
              members: HateoasLinkBuilder.getNestedResourceLink(req, location.id, location.city, 'members')
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
      console.log('The req.params: ', req.params)
      const location = {
        location: req.params.id
      }
      const locationId = req.params.id

      const membersOfLocation = await this.#memberService.getNestedResourceById(location)

      console.log('Members of location: ', membersOfLocation)

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getNestedResourceLink(req, locationId, 'members'),
          create: HateoasLinkBuilder.getCreateLink(req, 'location')
        },
        _embedded: {
          members: membersOfLocation.map(member => ({
            id: member.id,
            name: member.name,
            _links: {
              self: HateoasLinkBuilder.getNestedResourceByIdLink(req, locationId, 'members', member.id)
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
      const newLocation = await this.#service.insert({
        city: req.body.city
      })

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, newLocation._id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceByIdLink(req, newLocation._id, newLocation.city),
          update: HateoasLinkBuilder.getUpdateLink(req, newLocation._id, newLocation.city),
          delete: HateoasLinkBuilder.getDeleteLink(req, newLocation._id, newLocation.city)
        },
        _embedded: {
          location: newLocation
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

      await this.#service.replace(req.params.id, { city })

      const updatedLocation = await this.#service.getById(req.params.id)

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, updatedLocation._id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceByIdLink(req, updatedLocation._id, updatedLocation.city),
          create: HateoasLinkBuilder.getCreateLink(req),
          delete: HateoasLinkBuilder.getDeleteLink(req, updatedLocation._id, updatedLocation.city)
        },
        _embedded: {
          location: updatedLocation
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
      const deletedLocationId = req.params.id
      await this.#service.delete(deletedLocationId)

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, deletedLocationId._id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceByIdLink(req, deletedLocationId._id, deletedLocationId.city),
          create: HateoasLinkBuilder.getCreateLink(req)
        },
        _embedded: {
          location: deletedLocationId
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
