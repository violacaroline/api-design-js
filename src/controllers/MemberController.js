/**
 * Module for the MemberController.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import { MemberModel } from '../models/MemberModel.js'
import { MemberService } from '../services/MemberService.js'
import { FarmService } from '../services/FarmService.js'
import { HateoasLinkBuilder } from '../util/hateoasLinkBuilder.js'

/**
 * Encapsulates a controller.
 */
export class MemberController {
  /**
   * The service.
   *
   * @type {MemberService} - The MemberService instance.
   */
  #service

  /**
   * The farmService.
   *
   * @type {FarmService} - The FarmService instance.
   */
  #farmService

  /**
   * Initializes a new instance.
   *
   * @param {MemberService} service - A service instantiated from a class with the same capabilities as MemberService.
   * @param {FarmService} farmService - A service instantiated from a class with the same capabilities as FarmService.
   */
  constructor (service = new MemberService(), farmService = new FarmService()) {
    this.#service = service
    this.#farmService = farmService
  }

  /**
   * Provide req.member to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the member to load.
   */
  async loadMember (req, res, next, id) {
    try {
      // Get the Member.
      const member = await this.#service.getById(id)

      // If no member found send a 404 (Not Found).
      if (!member) {
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      // Provide the member to req.
      req.member = member

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Authenticates a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      const member = await MemberModel.authenticate(req.body.email, req.body.password)

      const payload = {
        sub: member.id,
        name: member.name,
        location: member.location,
        phone: member.phone,
        email: member.email
      }

      const privateKey = Buffer.from(process.env.ACCESS_TOKEN_SECRET_PRIVATE, 'base64')

      const accessToken = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: 60 * 1000 * 20
      })

      res
        .json({
          name: member.name,
          user_id: member.id,
          access_token: accessToken,
          message: 'You are logged in'
        })
    } catch (error) {
      // Authentication failed.
      const err = createError(401)
      err.cause = error

      next(err)
    }
  }

  /**
   * Sends a JSON response containing a member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    try {
      const member = req.member

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getResourceByIdLink(req, member.id, member.name),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          update: HateoasLinkBuilder.getUpdateLink(req, member.id, member.name),
          delete: HateoasLinkBuilder.getDeleteLink(req, member.id, member.name),
          farms: HateoasLinkBuilder.getNestedResourceLink(req, member.id, 'farms') // NOT GOOD - HARDCODED???
        },
        _embedded: {
          member: {
            id: member.id,
            name: member.name,
            location: member.location,
            _links: {
              self: HateoasLinkBuilder.getPlainResourceLink(req, member.id)
            }
          }
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
   * Sends a JSON response containing all members.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const members = await this.#service.get()

      const totalCount = members.length
      const perPage = parseInt(req.query.perPage) || 5
      const page = parseInt(req.query.page) || 1
      const totalPages = Math.ceil(totalCount / perPage)

      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage

      const paginatedMembers = members.slice(startIndex, endIndex)

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getBaseUrlLink(req),
          create: HateoasLinkBuilder.getCreateLink(req),
          prev: page > 1 ? HateoasLinkBuilder.getPageLink(req, page - 1, perPage) : null,
          next: page < totalPages ? HateoasLinkBuilder.getPageLink(req, page + 1, perPage) : null,
          last: HateoasLinkBuilder.getPageLink(req, totalPages, perPage),
          count: totalCount
        },
        _embedded: {
          members: paginatedMembers.map(member => ({
            id: member.id,
            name: member.name,
            location: member.location,
            _links: {
              self: HateoasLinkBuilder.getPlainResourceLink(req, member.id),
              getById: HateoasLinkBuilder.getResourceByIdLink(req, member.id, member.name),
              update: HateoasLinkBuilder.getUpdateLink(req, member.id, member.name),
              delete: HateoasLinkBuilder.getDeleteLink(req, member.id, member.name),
              farms: HateoasLinkBuilder.getNestedResourceLink(req, member.id, 'farms')
            }
          }))
        }
      }

      // const halResponse = {
      //   _links: {
      //     self: HateoasLinkBuilder.getBaseUrlLink(req),
      //     create: HateoasLinkBuilder.getCreateLink(req)
      //   },
      //   _embedded: {
      //     members: members.map(member => ({
      //       id: member.id,
      //       name: member.name,
      //       location: member.location,
      //       _links: {
      //         self: HateoasLinkBuilder.getPlainResourceLink(req, member.id),
      //         getById: HateoasLinkBuilder.getResourceByIdLink(req, member.id, member.name),
      //         update: HateoasLinkBuilder.getUpdateLink(req, member.id, member.name),
      //         delete: HateoasLinkBuilder.getDeleteLink(req, member.id, member.name),
      //         farms: HateoasLinkBuilder.getNestedResourceLink(req, member.id, 'farms')
      //       }
      //     }))
      //   }
      // }
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
  async findFarmsByMember (req, res, next) {
    try {
      const member = {
        member: req.params.id
      }
      const memberId = req.params.id

      const farmsOfMember = await this.#farmService.getAllResourcesByFilter(member)

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getNestedResourceLink(req, memberId, 'farms'),
          create: HateoasLinkBuilder.getCreateLink(req)
        },
        _embedded: {
          farms: farmsOfMember.map(farm => ({
            name: farm.name,
            member: farm.member,
            _links: {
              self: HateoasLinkBuilder.getNestedResourceByIdLink(req, memberId, 'farms', farm.id)
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
   * Creates a new member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const newMember = await this.#service.insert({
        name: req.body.name,
        location: req.body.location,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password
      })

      await newMember.save()

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, newMember.id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceByIdLink(req, newMember.id, newMember.name),
          update: HateoasLinkBuilder.getUpdateLink(req, newMember.id, newMember.name),
          delete: HateoasLinkBuilder.getDeleteLink(req, newMember.id, newMember.name)
        },
        _embedded: {
          member: {
            id: newMember.id,
            name: newMember.name,
            location: newMember.location,
            _links: {
              self: HateoasLinkBuilder.getPlainResourceLink(req, newMember.id)
            }
          }
        }
      }

      res
        .status(201)
        .json(halResponse)
        .end()
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        // Duplicate email error
        const error = new Error('Email address already in use')
        error.status = 409
        next(error)
      } else {
        const err = createError(error.name === 'ValidationError'
          ? 400 // Bad format
          : 500 // Something went really wrong
        )
        err.cause = error

        next(error)
      }
    }
  }

  /**
   * Updates parts of a specific member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async patch (req, res, next) {
    try {
      const { name, location, phone, email, password } = req.body

      await this.#service.update(req.params.id, { name, location, phone, email, password })

      const patchedMember = await this.#service.getById(req.params.id)

      await patchedMember.save()

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, patchedMember.id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceByIdLink(req, patchedMember.id, patchedMember.name),
          create: HateoasLinkBuilder.getCreateLink(req),
          delete: HateoasLinkBuilder.getDeleteLink(req, patchedMember.id, patchedMember.name)
        },
        _embedded: {
          member: {
            id: patchedMember.id,
            name: patchedMember.name,
            location: patchedMember.location,
            _links: {
              self: HateoasLinkBuilder.getPlainResourceLink(req, patchedMember.id)
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
   * Completely updates a specific member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const { name, location, phone, email, password } = req.body

      await this.#service.replace(req.params.id, { name, location, phone, email, password })

      const updatedMember = await this.#service.getById(req.params.id)

      await updatedMember.save()

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, updatedMember.id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceByIdLink(req, updatedMember.id, updatedMember.name),
          create: HateoasLinkBuilder.getCreateLink(req),
          delete: HateoasLinkBuilder.getDeleteLink(req, updatedMember.id, updatedMember.name)
        },
        _embedded: {
          member: {
            id: updatedMember.id,
            name: updatedMember.name,
            location: updatedMember.location,
            _links: {
              self: HateoasLinkBuilder.getPlainResourceLink(req, updatedMember.id)
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
   * Deletes the specified member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      const deletedMemberId = req.params.id
      await this.#service.delete(deletedMemberId)

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
