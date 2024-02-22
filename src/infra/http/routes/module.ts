import { type FastifyInstance } from 'fastify'
import { editModuleDetailsController } from '../controllers/edit-module-details'
import { fetchCourseModulesController } from '../controllers/fetch-course-modules'
import { fetchModuleClassesController } from '../controllers/fetch-module-classes'
import { registerModuleToCourseController } from '../controllers/register-module-to-course'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function moduleRoutes(app: FastifyInstance) {
  app.get('/courses/:courseId/modules', { onRequest: [verifyJwt] }, fetchCourseModulesController)
  app.get('/modules/:moduleId/classes', { onRequest: [verifyJwt] }, fetchModuleClassesController)

  app.post('/courses/:courseId/modules', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, registerModuleToCourseController)

  app.put('/modules/:moduleId', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, editModuleDetailsController)
}
