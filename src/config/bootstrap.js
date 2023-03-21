/**
 * Module for bootstrapping.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 2.0.0
 */

import { IoCContainer } from '../util/IoCContainer.js'
import { LocationModel } from '../models/LocationModel.js'
import { LocationRepository } from '../repositories/LocationRepository.js'
import { LocationService } from '../services/LocationService.js'
import { LocationController } from '../controllers/LocationController.js'

const iocContainer = new IoCContainer()

iocContainer.register('ConnectionString', process.env.DB_CONNECTION_STRING)

iocContainer.register('LocationModelType', LocationModel, { type: true })

iocContainer.register('LocationRepositorySingleton', LocationRepository, {
  dependencies: [
    'LocationModelType'
  ],
  singleton: true
})

iocContainer.register('LocationServiceSingleton', LocationService, {
  dependencies: [
    'LocationRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('LocationController', LocationController, {
  dependencies: [
    'LocationServiceSingleton'
  ]
})

export const container = Object.freeze(iocContainer)
