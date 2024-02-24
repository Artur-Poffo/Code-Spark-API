import { type FastifyInstance } from 'fastify'
import { deleteCourseCertificateController } from '../controllers/delete-course-certificate'
import { registerCertificateForCourseController } from '../controllers/register-certificate-for-course'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function certificateRoutes(app: FastifyInstance) {
  app.post('/courses/:courseId/certificates/images/:imageId', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, registerCertificateForCourseController)

  app.delete('/courses/:courseId/certificates/:certificateId', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, deleteCourseCertificateController)
}
