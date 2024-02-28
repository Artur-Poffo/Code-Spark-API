import { type FastifyInstance } from 'fastify'
import { getVideoDetailsController } from '../controllers/get-video-details'
import { getVideoDetailsByIdController } from '../controllers/get-video-details-by-id'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function videoRoutes(app: FastifyInstance) {
  app.get('/videos/find/key/:fileKey', { onRequest: [verifyJwt] }, getVideoDetailsController)
  app.get('/videos/find/id/:videoId', { onRequest: [verifyJwt] }, getVideoDetailsByIdController)
}
