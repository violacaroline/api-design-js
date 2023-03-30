/**
 * API version 1 routes.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import express from 'express'
import { MemberModel } from '../../../models/MemberModel.js'

export const router = express.Router()

/* ================= RESOLVE CONTROLLERS ================= */

/**
 * Resolves a MemberController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a MemberController object.
 */
const resolveMemberController = (req) => req.app.get('container').resolve('MemberController')

/**
 * Resolves a FarmController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a FarmController object.
 */
const resolveFarmController = (req) => req.app.get('container').resolve('FarmController')

/**
 * Resolves a ProductController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a ProductController object.
 */
const resolveProductController = (req) => req.app.get('container').resolve('ProductController')

/* =========== LOAD INSTANCES IF RELEVANT ID IS PRESENT ========== */

// Provide req.member to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => resolveMemberController(req).loadMember(req, res, next, id))

router.param('farmId', (req, res, next, farmId) => resolveFarmController(req).loadFarm(req, res, next, farmId))

// Provide req.product to the route if :productId is present in the route path.
router.param('productId', (req, res, next, productId) => resolveProductController(req).loadProduct(req, res, next, productId))

/* ================= HANDLES MEMBER REQUESTS ================= */

// Authenticate a member
router.post('/login', (req, res, next) => resolveMemberController(req).login(req, res, next))

// GET members
router.get('/', MemberModel.authenticateJWT, (req, res, next) => resolveMemberController(req).findAll(req, res, next))

// GET member/:id
router.get('/:id', MemberModel.authenticateJWT, (req, res, next) => resolveMemberController(req).find(req, res, next))

// POST - Create a member
router.post('/', (req, res, next) => resolveMemberController(req).create(req, res, next))

// PATCH member/:id
router.patch('/:id', MemberModel.authenticateJWT, (req, res, next) => resolveMemberController(req).patch(req, res, next))

// PUT member/:id
router.put('/:id', MemberModel.authenticateJWT, (req, res, next) => resolveMemberController(req).update(req, res, next))

// DELETE member/:id
router.delete('/:id', MemberModel.authenticateJWT, (req, res, next) => resolveMemberController(req).delete(req, res, next))

/* ================= HANDLES A MEMBER'S FARM REQUESTS ================= */

// GET member/:id/farm/:farmId. Get a member's specific farm.
router.get('/:id/farms/:farmId', (req, res, next) => resolveFarmController(req).find(req, res, next))

// GET member/:id/farms - Get ALL farms of a member.
router.get('/:id/farms', (req, res, next) => resolveFarmController(req).findFarmsByMember(req, res, next))

// POST member/:id/farms - Create a members farm.
router.post('/:id/farms', MemberModel.authenticateJWT, (req, res, next) => resolveFarmController(req).create(req, res, next))

// PUT members/:id/farm/:id - Update a members farm.
router.put('/:id/farms/:farmId', MemberModel.authenticateJWT, (req, res, next) => resolveFarmController(req).update(req, res, next))

// DELETE members/:id/farm/:id - Delete a members farm.
router.delete('/:id/farms/:farmId', MemberModel.authenticateJWT, (req, res, next) => resolveFarmController(req).delete(req, res, next))

/* ================= HANDLES A MEMBER'S FARMS'S PRODUCT REQUESTS ================= */

// GET - Get a farm's specific product.
router.get('/:id/farms/:farmId/products/:productId', (req, res, next) => resolveProductController(req).find(req, res, next))

// GET - Get ALL products of a farm.
router.get('/:id/farms/:farmId/products', (req, res, next) => resolveProductController(req).findProductsByFarm(req, res, next))

// POST - Create a farms product.
router.post('/:id/farms/:farmId/products', MemberModel.authenticateJWT, (req, res, next) => resolveProductController(req).create(req, res, next))

// PUT - Update a farm's product.
router.put('/:id/farms/:farmId/products/:productId', MemberModel.authenticateJWT, (req, res, next) => resolveProductController(req).update(req, res, next))

// DELETE - Delete a farm's product.
router.delete('/:id/farms/:farmId/products/:productId', MemberModel.authenticateJWT, (req, res, next) => resolveProductController(req).delete(req, res, next))
