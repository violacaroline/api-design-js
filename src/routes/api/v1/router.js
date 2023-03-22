/**
 * API version 1 routes.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import express from 'express'
import { router as locationRouter } from './locationRouter.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple Froot Boot RESTful API!' }))

router.use('/locations', locationRouter)
