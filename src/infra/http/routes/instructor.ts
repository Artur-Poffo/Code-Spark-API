import { type FastifyInstance } from 'fastify'
import { fetchInstructorCoursesController } from '../controllers/fetch-instructor-courses'

export async function instructorRoutes(app: FastifyInstance) {
  app.get('/instructors/:instructorId/courses', fetchInstructorCoursesController)
}
