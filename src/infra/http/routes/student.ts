import { type FastifyInstance } from 'fastify'
import { fetchStudentCoursesController } from '../controllers/fetch-student-courses'

export async function studentRoutes(app: FastifyInstance) {
  app.get('/students/:studentId/enrollments', fetchStudentCoursesController)
}
