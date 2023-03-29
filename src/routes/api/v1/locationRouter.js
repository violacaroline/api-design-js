/**
 * API version 1 location routes.
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

// Provide req.location to the route if :slug is present in the route path.
router.param('slug', (req, res, next, slug) => resolveLocationController(req).loadLocation(req, res, next, slug))

// GET locations
router.get('/', (req, res, next) => resolveLocationController(req).findAll(req, res, next))

// GET location/:slug
router.get('/:slug', (req, res, next) => resolveLocationController(req).find(req, res, next))

// GET location/:slug/members
router.get('/:slug/members', (req, res, next) => resolveLocationController(req).findMembersByLocation(req, res, next))

// POST location
router.post('/', (req, res, next) => resolveLocationController(req).create(req, res, next))

// PUT location/:slug
router.put('/:slug', (req, res, next) => resolveLocationController(req).update(req, res, next))

// DELETE location/:slug
router.delete('/:slug', (req, res, next) => resolveLocationController(req).delete(req, res, next))
