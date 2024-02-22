import { upload } from '@/infra/app'
import { makeOnImageKeyGenerated } from '@/infra/events/factories/make-on-image-key-generated'
import { makeOnImageUploaded } from '@/infra/events/factories/make-on-image-uploaded'
import { type FastifyInstance, type FastifyRequest } from 'fastify'
import { uploadImageController } from '../controllers/upload-image'
import { verifyJwt } from '../middlewares/verify-jwt'

export interface CustomRequest extends FastifyRequest {
  makeOnImageKeyGenerated: typeof makeOnImageKeyGenerated
}

export async function imageRoutes(app: FastifyInstance) {
  makeOnImageUploaded()
  makeOnImageKeyGenerated()

  app.post('/images', { onRequest: [verifyJwt], preHandler: [upload.single('image')] }, uploadImageController)
}
