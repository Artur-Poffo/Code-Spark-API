import { type FastifyInstance } from 'fastify'
import { attachTagsToCourseController } from '../controllers/attach-tags-to-course'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function courseTagRoutes(app: FastifyInstance) {
  app.post('/courses/:courseId/tags', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, attachTagsToCourseController)
}
