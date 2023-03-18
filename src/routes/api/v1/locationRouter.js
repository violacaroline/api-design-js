/**
 * API version 1 routes.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import express from 'express'

export const router = express.Router()

/**
 * Resolves a LocationController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a LocationController object.
 */
const resolveLocationController = (req) => req.app.get('container').resolve('LocationController')

// Provide req.location to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => resolveLocationController(req).loadTask(req, res, next, id))

// GET locations
router.get('/', (req, res, next) => resolveLocationController(req).findAll(req, res, next))

// GET location/:id
router.get('/:id', (req, res, next) => resolveLocationController(req).find(req, res, next))

// POST location
router.post('/', (req, res, next) => resolveLocationController(req).create(req, res, next))

// DELETE location/:id
router.delete('/:id', (req, res, next) => resolveLocationController(req).delete(req, res, next))
