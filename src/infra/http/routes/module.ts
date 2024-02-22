import { type FastifyInstance } from 'fastify'
import { registerModuleToCourseController } from '../controllers/register-module-to-course'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function moduleRoutes(app: FastifyInstance) {
  app.post('/courses/:courseId/modules', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, registerModuleToCourseController)
}
