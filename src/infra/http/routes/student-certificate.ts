import { type FastifyInstance } from 'fastify'
import { issueCertificateController } from '../controllers/issue-certificate'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function studentCertificateRoutes(app: FastifyInstance) {
  app.post('/enrollments/:enrollmentId/certificates/issue', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, issueCertificateController)
}
