import { type FastifyInstance } from 'fastify'
import { getUserDetailsController } from '../controllers/get-user-details'
import { registerUserController } from '../controllers/register-user'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', registerUserController)

  app.get('/users/:userId', getUserDetailsController)
}
