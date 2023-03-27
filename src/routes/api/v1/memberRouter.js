/**
 * API version 1 routes.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import express from 'express'

export const router = express.Router()

/**
 * Resolves a MemberController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a MemberController object.
 */
const resolveMemberController = (req) => req.app.get('container').resolve('MemberController')

// Provide req.member to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => resolveMemberController(req).loadMember(req, res, next, id))

// FIX THIS ---------------------
// Authenticate a member
router.post('/login', (req, res, next) => resolveMemberController(req).login(req, res, next))

// GET members
router.get('/', (req, res, next) => resolveMemberController(req).findAll(req, res, next))

// GET member/:id
router.get('/:id', (req, res, next) => resolveMemberController(req).find(req, res, next))

// GET member/:id/farms
router.get('/:id/farms', (req, res, next) => resolveMemberController(req).findFarmsByMember(req, res, next))

// POST - Create a member
router.post('/', (req, res, next) => resolveMemberController(req).create(req, res, next))

// PATCH member/:id
router.patch('/:id', (req, res, next) => resolveMemberController(req).patch(req, res, next))

// PUT member/:id
router.put('/:id', (req, res, next) => resolveMemberController(req).update(req, res, next))

// DELETE member/:id
router.delete('/:id', (req, res, next) => resolveMemberController(req).delete(req, res, next))
