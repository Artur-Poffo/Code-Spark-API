import { type FastifyInstance } from 'fastify'
import { registerCourseController } from '../controllers/register-course'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function courseRoutes(app: FastifyInstance) {
  app.post('/courses', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, registerCourseController)
}
