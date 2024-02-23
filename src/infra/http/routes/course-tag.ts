import { type FastifyInstance } from 'fastify'
import { attachTagsToCourseController } from '../controllers/attach-tags-to-course'
import { fetchCourseTagsController } from '../controllers/fetch-course-tags'
import { removeTagFromCourseController } from '../controllers/remove-tag-from-course'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function courseTagRoutes(app: FastifyInstance) {
  app.get('/courses/:courseId/tags', fetchCourseTagsController)

  app.post('/courses/:courseId/tags', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, attachTagsToCourseController)

  app.delete('/courses/:courseId/tags/:tagId', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, removeTagFromCourseController)
}
