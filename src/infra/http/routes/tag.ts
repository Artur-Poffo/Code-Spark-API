import { type FastifyInstance } from 'fastify'
import { fetchRecentTagsController } from '../controllers/fetch-recent-tags'
import { registerTagsController } from '../controllers/register-tags'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function tagRoutes(app: FastifyInstance) {
  app.get('/tags', fetchRecentTagsController)

  app.post('/tags', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, registerTagsController)
}
