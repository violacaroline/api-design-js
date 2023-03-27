/**
 * API version 1 routes.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import express from 'express'
import { router as locationRouter } from './locationRouter.js'
import { router as memberRouter } from './memberRouter.js'
import { router as farmRouter } from './farmRouter.js'
import { router as productRouter } from './productRouter.js'
import { router as webHookRouter } from './webHookRouter.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple Froot Boot RESTful API!' }))

router.use('/locations', locationRouter)

router.use('/members', memberRouter)

router.use('/farms', farmRouter)

router.use('/products', productRouter)

router.use('/webhooks', webHookRouter)
