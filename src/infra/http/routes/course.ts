import { type FastifyInstance } from 'fastify'
import { deleteCourseController } from '../controllers/delete-course'
import { editCourseDetailsController } from '../controllers/edit-course-details'
import { fetchCourseStudentsController } from '../controllers/fetch-course-students'
import { fetchRecentCoursesController } from '../controllers/fetch-recent-courses'
import { getCourseDetailsController } from '../controllers/get-course-details'
import { getCourseInstructorDetailsController } from '../controllers/get-course-instructor-details'
import { getCourseMetricsController } from '../controllers/get-course-metrics'
import { getCourseStatsController } from '../controllers/get-course-stats'
import { queryCoursesByNameController } from '../controllers/query-courses-by-name'
import { queryCoursesByTagController } from '../controllers/query-courses-by-tags'
import { registerCourseController } from '../controllers/register-course'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function courseRoutes(app: FastifyInstance) {
  app.get('/courses', fetchRecentCoursesController)
  app.get('/courses/:courseId', getCourseDetailsController)
  app.get('/courses/filter/name', queryCoursesByNameController)
  app.get('/courses/filter/tags', queryCoursesByTagController)
  app.get('/courses/:courseId/stats', getCourseStatsController)
  app.get('/courses/:courseId/students', fetchCourseStudentsController)
  app.get('/courses/:courseId/instructors', getCourseInstructorDetailsController)

  app.get('/courses/:courseId/metrics', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, getCourseMetricsController)

  app.post('/courses', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, registerCourseController)

  app.put('/courses/:courseId', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, editCourseDetailsController)

  app.delete('/courses/:courseId', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, deleteCourseController)
}
