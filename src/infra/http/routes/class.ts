import { type FastifyInstance } from 'fastify'
import { addClassToModuleController } from '../controllers/add-class-to-module'
import { deleteClassController } from '../controllers/delete-class'
import { editClassDetailsController } from '../controllers/edit-class-details'
import { fetchCourseClassesController } from '../controllers/fetch-course-classes'
import { getClassDetailsController } from '../controllers/get-class-details'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function classRoutes(app: FastifyInstance) {
  app.get('/classes/:classId', { onRequest: [verifyJwt] }, getClassDetailsController)
  app.get('/courses/:courseId/classes', { onRequest: [verifyJwt] }, fetchCourseClassesController)

  app.post('/modules/:moduleId/classes/video/:videoId', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, addClassToModuleController)

  app.put('/classes/:classId', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, editClassDetailsController)

  app.delete('/classes/:classId', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, deleteClassController)
}
