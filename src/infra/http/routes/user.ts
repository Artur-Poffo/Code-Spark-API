import { type FastifyInstance } from 'fastify'
import { authenticateUserController } from '../controllers/authenticate'
import { editUserDetailsController } from '../controllers/edit-user-details'
import { getUserDetailsController } from '../controllers/get-user-details'
import { registerUserController } from '../controllers/register-user'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', registerUserController)
  app.post('/sessions', authenticateUserController)

  app.put('/users', { onRequest: verifyJwt }, editUserDetailsController)

  app.get('/users/:userId', getUserDetailsController)
}
