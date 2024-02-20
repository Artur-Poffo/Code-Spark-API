import { type FastifyInstance } from 'fastify'
import { getCourseDetailsController } from '../controllers/get-course-details'
import { registerCourseController } from '../controllers/register-course'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function courseRoutes(app: FastifyInstance) {
  app.get('/courses/:courseId', getCourseDetailsController)

  app.post('/courses', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, registerCourseController)
}
