import { type FastifyInstance } from 'fastify'
import { editEvaluationDetailsController } from '../controllers/edit-evaluation-details'
import { evaluateClassController } from '../controllers/evaluate-class'
import { getCourseEvaluationsAverageController } from '../controllers/get-course-evaluations-average'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function evaluationRoutes(app: FastifyInstance) {
  app.get('/courses/:courseId/evaluations/average', getCourseEvaluationsAverageController)

  app.post('/courses/:courseId/classes/:classId/evaluations', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, evaluateClassController)

  app.put('/evaluations/:evaluationId', { onRequest: [verifyJwt, verifyUserRole('STUDENT')] }, editEvaluationDetailsController)
}
