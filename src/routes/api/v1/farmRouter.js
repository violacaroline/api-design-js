/**
 * API version 1 farm routes.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import express from 'express'

export const router = express.Router()

/**
 * Resolves a FarmController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a FarmController object.
 */
const resolveFarmController = (req) => req.app.get('container').resolve('FarmController')

// Provide req.farm to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => resolveFarmController(req).loadFarm(req, res, next, id))

// GET farm
router.get('/', (req, res, next) => resolveFarmController(req).findAll(req, res, next))

// GET farm/:id
router.get('/:id', (req, res, next) => resolveFarmController(req).find(req, res, next))

// POST farm
router.post('/', (req, res, next) => resolveFarmController(req).create(req, res, next))

// PUT farm/:id
router.put('/:id', (req, res, next) => resolveFarmController(req).update(req, res, next))

// DELETE farm/:id
router.delete('/:id', (req, res, next) => resolveFarmController(req).delete(req, res, next))
