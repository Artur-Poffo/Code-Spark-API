import { type FastifyInstance } from 'fastify'
import { getCourseDetailsController } from '../controllers/get-course-details'
import { queryCoursesByNameController } from '../controllers/query-courses-by-name'
import { registerCourseController } from '../controllers/register-course'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function courseRoutes(app: FastifyInstance) {
  app.get('/courses/:courseId', getCourseDetailsController)
  app.get('/courses/filter/name', queryCoursesByNameController)

  app.post('/courses', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, registerCourseController)
}
