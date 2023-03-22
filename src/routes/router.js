/**
 * The routes.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as v1Router } from './api/v1/router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'This will be version 1 of this very simple Froot Boot RESTful API!' }))

router.use('/api/v1/froot-boot', v1Router)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
