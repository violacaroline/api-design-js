/**
 * API version 1 Product routes.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import express from 'express'

export const router = express.Router()

/**
 * Resolves a ProductController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a ProductController object.
 */
const resolveProductController = (req) => req.app.get('container').resolve('ProductController')

// Provide req.product to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => resolveProductController(req).loadProduct(req, res, next, id))

// GET product
router.get('/', (req, res, next) => resolveProductController(req).findAll(req, res, next))

// GET product/:id
router.get('/:id', (req, res, next) => resolveProductController(req).find(req, res, next))

// POST product
router.post('/', (req, res, next) => resolveProductController(req).create(req, res, next))

// PUT product/:id
router.put('/:id', (req, res, next) => resolveProductController(req).update(req, res, next))

// DELETE product/:id
router.delete('/:id', (req, res, next) => resolveProductController(req).delete(req, res, next))
