import { HateoasLinkBuilder } from '../util/HateoasLinkBuilder.js'
/**
 * Encapsulating a FrootBootController
 */
export class FrootBootController {
  /**
   * Send back available resources when requesting entry point.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  get (req, res, next) {
    try {
      const halResponse = {
        _links: {
          self: HateoasLinkBuilder.getBaseUrlLink(req),
          locations: HateoasLinkBuilder.getBaseUrlLink(req).href + '/locations',
          members: HateoasLinkBuilder.getBaseUrlLink(req).href + '/members'
        }
      }
      res
        .status(200)
        .json(halResponse)
        .end()
    } catch (error) {
      next(error)
    }
  }
}
