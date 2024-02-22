import { type FastifyInstance } from 'fastify'
import { registerTagsController } from '../controllers/register-tags'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function tagRoutes(app: FastifyInstance) {
  app.post('/tags', { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] }, registerTagsController)
}
