import { type FastifyInstance } from 'fastify'
import { getImageDetailsController } from '../controllers/get-image-details'
import { getImageDetailsByIdController } from '../controllers/get-image-details-by-id'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function imageRoutes(app: FastifyInstance) {
  app.get('/images/find/key/:fileKey', { onRequest: [verifyJwt] }, getImageDetailsController)
  app.get('/images/find/id/:imageId', { onRequest: [verifyJwt] }, getImageDetailsByIdController)
}
