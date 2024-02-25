import { type FastifyInstance } from 'fastify'
import { authenticateUserController } from '../controllers/authenticate'
import { deleteUserController } from '../controllers/delete-user'
import { editUserDetailsController } from '../controllers/edit-user-details'
import { getAuthenticatedUserDetailsController } from '../controllers/get-authenticated-user-details'
import { getUserDetailsController } from '../controllers/get-user-details'
import { registerUserController } from '../controllers/register-user'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.get('/users', { onRequest: [verifyJwt] }, getAuthenticatedUserDetailsController)
  app.get('/users/:userId', getUserDetailsController)

  app.post('/users', registerUserController)
  app.post('/sessions', authenticateUserController)

  app.put('/users', { onRequest: [verifyJwt] }, editUserDetailsController)

  app.delete('/users', { onRequest: [verifyJwt] }, deleteUserController)
}
