import { type FastifyInstance } from 'fastify'
import { cancelEnrollmentController } from '../controllers/cancel-enrollment'
import { enrollToCourseController } from '../controllers/enroll-to-course'
import { fetchEnrollmentCompletedClassesController } from '../controllers/fetch-enrollment-completed-classes'
import { fetchEnrollmentCompletedModulesController } from '../controllers/fetch-enrollment-completed-modules'
import { getEnrollmentDetailsController } from '../controllers/get-enrollment-details'
import { getStudentProgressController } from '../controllers/get-student-progress'
import { markCourseAsCompletedController } from '../controllers/mark-course-as-completed'
import { toggleMarkClassAsCompletedController } from '../controllers/toggle-mark-class-as-completed'
import { toggleMarkModuleAsCompletedController } from '../controllers/toggle-mark-module-as-completed'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function enrollmentRoutes(app: FastifyInstance) {
  app.get('/courses/:courseId/students/:studentId/enrollments', { onRequest: [verifyJwt] }, getEnrollmentDetailsController)
  app.get('/enrollments/:enrollmentId/classes/completed', { onRequest: [verifyJwt] }, fetchEnrollmentCompletedClassesController)
  app.get('/enrollments/:enrollmentId/modules/completed', { onRequest: [verifyJwt] }, fetchEnrollmentCompletedModulesController)
  app.get('/enrollments/:enrollmentId/progress', { onRequest: [verifyJwt] }, getStudentProgressController)

  app.post('/courses/:courseId/enroll', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, enrollToCourseController)
  app.post('/enrollments/:enrollmentId/classes/:classId/completed', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, toggleMarkClassAsCompletedController)
  app.post('/enrollments/:enrollmentId/modules/:moduleId/completed', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, toggleMarkModuleAsCompletedController)
  app.post('/enrollments/:enrollmentId/completed', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, markCourseAsCompletedController)

  app.delete('/enrollments/:enrollmentId', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, cancelEnrollmentController)
}
