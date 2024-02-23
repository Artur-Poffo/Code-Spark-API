import { type FastifyInstance } from 'fastify'
import { evaluateClassController } from '../controllers/evaluate-class'
import { getCourseEvaluationsAverageController } from '../controllers/get-course-evaluations-average'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function evaluationRoutes(app: FastifyInstance) {
  app.get('/courses/:courseId/evaluations/average', getCourseEvaluationsAverageController)

  app.post('/courses/:courseId/classes/:classId/evaluations', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, evaluateClassController)
}
