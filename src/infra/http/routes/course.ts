import { type FastifyInstance } from 'fastify'
import { deleteCourseController } from '../controllers/delete-course'
import { editCourseDetailsController } from '../controllers/edit-course-details'
import { getCourseDetailsController } from '../controllers/get-course-details'
import { queryCoursesByNameController } from '../controllers/query-courses-by-name'
import { queryCoursesByTagController } from '../controllers/query-courses-by-tags'
import { registerCourseController } from '../controllers/register-course'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function courseRoutes(app: FastifyInstance) {
  app.get('/courses/:courseId', getCourseDetailsController)
  app.get('/courses/filter/name', queryCoursesByNameController)
  app.get('/courses/filter/tags', queryCoursesByTagController)

  app.post('/courses', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, registerCourseController)

  app.put('/courses/:courseId', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, editCourseDetailsController)

  app.delete('/courses/:courseId', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, deleteCourseController)
}
