import { type FastifyInstance } from 'fastify'
import { registerUserController } from '../controllers/register-user'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', registerUserController)
}
