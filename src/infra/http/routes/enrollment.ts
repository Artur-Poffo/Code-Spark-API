import { type FastifyInstance } from 'fastify'
import { enrollToCourseController } from '../controllers/enroll-to-course'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function enrollmentRoutes(app: FastifyInstance) {
  app.get('/courses/:courseId/enroll', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, enrollToCourseController)
}
