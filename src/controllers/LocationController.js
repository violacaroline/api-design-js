/**
 * Module for the LocationController.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import createError from 'http-errors'
import { LocationService } from '../services/LocationService.js'
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
   * Initializes a new instance.
   *
   * @param {LocationService} service - A service instantiated from a class with the same capabilities as LocationService.
   */
  constructor (service = new LocationService()) {
    this.#service = service
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

    const locationUrl = new URL(
      `${req.protocol}://${req.get('host')}${req.baseUrl}/${location._id}`
    )

    const halResponse = {
      _links: {
        self: {
          href: HateoasLinkBuilder.getSelfLink()
        },
        get: {
          href: `${req.baseUrl}`,
          title: 'Get All Locations',
          description: 'Get a list of all locations'
        },
        update: {
          href: locationUrl.href,
          method: 'PUT',
          title: 'Update Location',
          description: `Update the ${location.city} location`
        },
        delete: {
          href: locationUrl.href,
          method: 'DELETE',
          title: 'Delete Location',
          description: `Delete the ${location.city} location`
        },
        members: {
          href: `${locationUrl.href}/members`,
          title: 'Get Members',
          description: `Get members of the ${location.city} location`
        }
      },
      _embedded: {
        location
      }
    }

    res
      .json(halResponse)
      .status(200)
    // res.json(req.location)
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

      // const locationBaseUrl = new URL(
      //   `${req.protocol}://${req.get('host')}${req.baseUrl}`
      // )

      const halResponse = {
        _links: {
          self: {
            href: HateoasLinkBuilder.getSelfLink(req)
          },
          create: HateoasLinkBuilder.getCreateLink(req, 'location')
        },
        _embedded: {
          locations: locations.map(location => ({
            id: location.id,
            city: location.city,
            _links: {
              self: {
                href: HateoasLinkBuilder.getResourceLink(req, location.id)
              },
              getById: {
                href: HateoasLinkBuilder.getResourceLink(req, location.id),
                title: 'Get Location by ID',
                description: 'Get a specific location by ID'
              },
              update: HateoasLinkBuilder.getUpdateLink(req, location.id, location.city),
              delete: HateoasLinkBuilder.getDeleteLink(req, location.id, location.city),
              members: {
                href: HateoasLinkBuilder.getResourceLink(req, location.id) + '/members',
                title: 'Get Members',
                description: `Get members of the ${location.city} location`
              }
            }
          }))
        }
      }
      res
        .json(halResponse)
        .status(200)

      // res.json(locations)
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

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${newLocation._id}`
      )

      const halResponse = {
        _links: {
          self: {
            href: location.href
          },
          get: {
            href: `${req.baseUrl}`,
            title: 'Get All Locations',
            description: 'Get a list of all locations'
          },
          getById: {
            href: `/froot-boot/locations/${newLocation._id}`,
            title: 'Get Location by ID',
            description: 'Get a specific location by ID'
          },
          update: {
            href: location.href,
            method: 'PUT',
            title: 'Update Location',
            description: `Update the ${newLocation.city} location`
          },
          delete: {
            href: location.href,
            method: 'DELETE',
            title: 'Delete Location',
            description: `Delete the ${newLocation.city} location`
          }
        },
        _embedded: {
          location: newLocation
        }
      }

      res
        .location(location.href)
        .status(201)
        .json(halResponse)
      // res
      //   .location(location.href)
      //   .status(201)
      //   .json(newLocation)
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
      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${updatedLocation._id}`
      )

      const halResponse = {
        _links: {
          self: {
            href: location.href
          },
          get: {
            href: `${req.baseUrl}`,
            title: 'Get All Locations',
            description: 'Get a list of all locations'
          },
          getById: {
            href: `/froot-boot/locations/${updatedLocation._id}`,
            title: 'Get Location by ID',
            description: 'Get a specific location by ID'
          },
          create: {
            href: `${req.baseUrl}`,
            method: 'POST',
            title: 'Create Location',
            description: 'Create a new location'
          },
          delete: {
            href: location.href,
            method: 'DELETE',
            title: 'Delete Location',
            description: `Delete the ${updatedLocation.city} location`
          }
        },
        _embedded: {
          location: updatedLocation
        }
      }

      res
        .location(location.href)
        .status(204)
        .json(halResponse)
        .end()
      // res
      //   .status(204)
      //   .end()
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
      const deletedLocation = req.params.id
      await this.#service.delete(deletedLocation)

      const halResponse = {
        _links: {
          self: {
            href: `${req.baseUrl}/${deletedLocation}`,
            method: 'DELETE',
            title: 'Delete Location',
            description: `Delete the location with id ${deletedLocation}`
          },
          get: {
            href: `${req.baseUrl}`,
            title: 'Get All Locations',
            description: 'Get a list of all locations'
          },
          getById: {
            href: `/froot-boot/locations/${deletedLocation}`,
            title: 'Get Location by ID',
            description: 'Get a specific location by ID'
          },
          create: {
            href: `${req.baseUrl}`,
            method: 'POST',
            title: 'Create Location',
            description: 'Create a new location'
          }
        }
      }

      res
        .status(204)
        .json(halResponse)
        .end()

      // res
      //   .status(204)
      //   .end()
    } catch (error) {
      next(error)
    }
  }
}
