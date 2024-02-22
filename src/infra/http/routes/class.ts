import { type FastifyInstance } from 'fastify'
import { fetchCourseClassesController } from '../controllers/fetch-course-classes'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function classRoutes(app: FastifyInstance) {
  app.get('/courses/:courseId/classes', { onRequest: [verifyJwt] }, fetchCourseClassesController)
}
