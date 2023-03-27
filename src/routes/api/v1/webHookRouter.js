/**
 * API version 1 webhook routes.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import express from 'express'

export const router = express.Router()

// POST farm
router.post('/register', (req, res, next) => console.log('Register WebHook'))
