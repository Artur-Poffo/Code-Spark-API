import { type FastifyInstance } from 'fastify'
import { evaluateClassController } from '../controllers/evaluate-class'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function evaluationRoutes(app: FastifyInstance) {
  app.post('/courses/:courseId/classes/:classId/evaluations', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, evaluateClassController)
}
