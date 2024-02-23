import { type FastifyInstance } from 'fastify'
import { cancelEnrollmentController } from '../controllers/cancel-enrollment'
import { enrollToCourseController } from '../controllers/enroll-to-course'
import { getEnrollmentDetailsController } from '../controllers/get-enrollment-details'
import { markClassAsCompletedController } from '../controllers/mark-class-as-completed'
import { markCourseAsCompletedController } from '../controllers/mark-course-as-completed'
import { markModuleAsCompletedController } from '../controllers/mark-module-as-completed'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function enrollmentRoutes(app: FastifyInstance) {
  app.get('/courses/:courseId/students/:studentId/enrollments', { onRequest: [verifyJwt] }, getEnrollmentDetailsController)

  app.post('/courses/:courseId/enroll', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, enrollToCourseController)
  app.post('/enrollments/:enrollmentId/classes/:classId', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, markClassAsCompletedController)
  app.post('/enrollments/:enrollmentId/modules/:moduleId', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, markModuleAsCompletedController)
  app.post('/enrollments/:enrollmentId/completed', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, markCourseAsCompletedController)

  app.delete('/enrollments/:enrollmentId', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, cancelEnrollmentController)
}
