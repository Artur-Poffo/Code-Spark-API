import { type FastifyInstance } from 'fastify'
import { authenticateController } from '../controllers/authenticate'
import { getUserDetailsController } from '../controllers/get-user-details'
import { registerUserController } from '../controllers/register-user'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', registerUserController)
  app.post('/sessions', authenticateController)

  app.get('/users/:userId', getUserDetailsController)
}
