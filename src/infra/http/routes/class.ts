import { type FastifyInstance } from 'fastify'
import { addClassToModuleController } from '../controllers/add-class-to-module'
import { fetchCourseClassesController } from '../controllers/fetch-course-classes'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function classRoutes(app: FastifyInstance) {
  app.get('/courses/:courseId/classes', { onRequest: [verifyJwt] }, fetchCourseClassesController)

  // FIXME: It should work after fixing the video repository
  app.post('/modules/:moduleId/classes/video/:videoId', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, addClassToModuleController)
}
