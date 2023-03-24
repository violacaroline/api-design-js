/**
 * Module for bootstrapping.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 2.0.0
 */

import { IoCContainer } from '../util/IoCContainer.js'

// LOCATION RELATED FILES
import { LocationModel } from '../models/LocationModel.js'
import { LocationRepository } from '../repositories/LocationRepository.js'
import { LocationService } from '../services/LocationService.js'
import { LocationController } from '../controllers/LocationController.js'

// MEMBER RELATED FILES
import { MemberModel } from '../models/MemberModel.js'
import { MemberRepository } from '../repositories/MemberRepository.js'
import { MemberService } from '../services/MemberService.js'
import { MemberController } from '../controllers/MemberController.js'

// Farm RELATED FILES
import { FarmModel } from '../models/FarmModel.js'
import { FarmRepository } from '../repositories/FarmRepository.js'
import { FarmService } from '../services/FarmService.js'
import { FarmController } from '../controllers/FarmController.js'

const iocContainer = new IoCContainer()

iocContainer.register('ConnectionString', process.env.DB_CONNECTION_STRING)

/* ====== REGISTER LOCATION RELATED ENTITIES ====== */
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

/* ====== REGISTER MEMBER RELATED ENTITIES ====== */
iocContainer.register('MemberModelType', MemberModel, { type: true })

iocContainer.register('MemberRepositorySingleton', MemberRepository, {
  dependencies: [
    'MemberModelType'
  ],
  singleton: true
})

iocContainer.register('MemberServiceSingleton', MemberService, {
  dependencies: [
    'MemberRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('MemberController', MemberController, {
  dependencies: [
    'MemberServiceSingleton'
  ]
})

/* ====== REGISTER FARM RELATED ENTITIES ====== */
iocContainer.register('FarmModelType', FarmModel, { type: true })

iocContainer.register('FarmRepositorySingleton', FarmRepository, {
  dependencies: [
    'FarmModelType'
  ],
  singleton: true
})

iocContainer.register('FarmServiceSingleton', FarmService, {
  dependencies: [
    'FarmRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('FarmController', FarmController, {
  dependencies: [
    'FarmServiceSingleton'
  ]
})

export const container = Object.freeze(iocContainer)
