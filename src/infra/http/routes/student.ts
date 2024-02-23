import { type FastifyInstance } from 'fastify'
import { fetchStudentCoursesController } from '../controllers/fetch-student-courses'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function studentRoutes(app: FastifyInstance) {
  app.get('/students/:studentId/enrollments', { onRequest: [verifyJwt] }, fetchStudentCoursesController)
}
