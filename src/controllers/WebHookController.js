/**
 * Module for the WebHookController.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import createError from 'http-errors'
import { WebHookService } from '../services/WebHookService.js'

/**
 * Encapsulates a controller.
 */
export class WebHookController {
  /**
   * The service.
   *
   * @type {WebHookService} - The WebHookService instance.
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {WebHookService} service - A service instantiated from a class with the same capabilities as WebHookService.
   */
  constructor (service = new WebHookService()) {
    this.#service = service
  }

  /**
   * Registers a URL as a WebHook for certain event.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async registerWebhookUrl (req, res, next) {
    try {
      // Validate the input data
      const { url, event } = req.body
      if (!url || !event) {
        const error = new Error('Invalid webhook data')
        error.status(400)
        throw error
      }

      const newWebHook = await this.#service.insert({ url, event })

      res
        .status(201)
        .json(newWebHook)
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
   * Unregisters a URL as a WebHook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async unRegisterWebhookUrl (req, res, next) {
    try {
      // AND HOW IS THAT A VISIBLE ID FOR SOMEONE? IS IT NOT ONLY FOR DATABASE?
      const deletedWebHookId = req.params.id
      await this.#service.delete(deletedWebHookId)

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }
}
