/**
 * API version 1 routes.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 1.0.0
 */

import express from 'express'
import { FrootBootController } from '../../../controllers/FrootBootController.js'
import { router as locationRouter } from './locationRouter.js'
import { router as memberRouter } from './memberRouter.js'
import { router as farmRouter } from './farmRouter.js'
import { router as productRouter } from './productRouter.js'
import { router as webHookRouter } from './webHookRouter.js'

export const router = express.Router()

const frootBootController = new FrootBootController()

router.get('/', (req, res, next) => frootBootController.get(req, res, next))

router.use('/locations', locationRouter)

router.use('/members', memberRouter)

router.use('/farms', farmRouter)

router.use('/products', productRouter)

router.use('/webhooks', webHookRouter)
