/**
 * API version 1 webhook routes.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import express from 'express'

export const router = express.Router()

/**
 * Resolves a WebHookController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a WebHookController object.
 */
const resolveWebHookController = (req) => req.app.get('container').resolve('WebHookController')

// POST Register a new webhook url
router.post('/register', (req, res, next) => resolveWebHookController(req).registerWebhookUrl(req, res, next))
