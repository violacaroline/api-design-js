/**
 * Module for the MemberController.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import createError from 'http-errors'
import { MemberService } from '../services/MemberService.js'
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
   * Initializes a new instance.
   *
   * @param {MemberService} service - A service instantiated from a class with the same capabilities as MemberService.
   */
  constructor (service = new MemberService()) {
    this.#service = service
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
   * Sends a JSON response containing a member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    const member = req.member

    /* SHOULD I REALLY USE ._id - OR ID? WHAT IS THE REASON FOR UNDERSCORE? */

    const halResponse = {
      _links: {
        self: HateoasLinkBuilder.getResourceLink(req, member._id, member.name),
        get: HateoasLinkBuilder.getBaseUrlLink(req),
        update: HateoasLinkBuilder.getUpdateLink(req, member._id, member.name),
        delete: HateoasLinkBuilder.getDeleteLink(req, member._id, member.name),
        members: HateoasLinkBuilder.getNextResourceLink(req, member._id, member.name, '/members') // NOT GOOD - HARDCODED
      },
      _embedded: {
        member
      }
    }

    res
      .json(halResponse)
      .status(200)
      .end()
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

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getBaseUrlLink(req),
          create: HateoasLinkBuilder.getCreateLink(req, 'member')
        },
        _embedded: {
          members: members.map(member => ({
            id: member.id,
            name: member.name,
            _links: {
              self: HateoasLinkBuilder.getPlainResourceLink(req, member.id),
              getById: HateoasLinkBuilder.getResourceLink(req, member.id, member.name),
              update: HateoasLinkBuilder.getUpdateLink(req, member.id, member.name),
              delete: HateoasLinkBuilder.getDeleteLink(req, member.id, member.name),
              farms: HateoasLinkBuilder.getNextResourceLink(req, member.id, member.name, '/members')
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
        city: req.body.city
      })

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, newMember._id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceLink(req, newMember._id, newMember.city),
          update: HateoasLinkBuilder.getUpdateLink(req, newMember._id, newMember.city),
          delete: HateoasLinkBuilder.getDeleteLink(req, newMember._id, newMember.city)
        },
        _embedded: {
          member: newMember
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
   * Completely updates a specific member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const { name, phone, email, password } = req.body

      await this.#service.replace(req.params.id, { name, phone, email, password })

      const updatedMember = await this.#service.getById(req.params.id)

      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getPlainResourceLink(req, updatedMember._id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceLink(req, updatedMember._id, updatedMember.name),
          create: HateoasLinkBuilder.getCreateLink(req),
          delete: HateoasLinkBuilder.getDeleteLink(req, updatedMember._id, updatedMember.name)
        },
        _embedded: {
          member: updatedMember
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
          self: HateoasLinkBuilder.getPlainResourceLink(req, deletedMemberId._id),
          get: HateoasLinkBuilder.getBaseUrlLink(req),
          getById: HateoasLinkBuilder.getResourceLink(req, deletedMemberId._id, deletedMemberId.name),
          create: HateoasLinkBuilder.getCreateLink(req)
        },
        _embedded: {
          member: deletedMemberId
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