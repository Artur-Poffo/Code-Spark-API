import { upload } from '@/infra/app'
import { makeOnFileUploaded } from '@/infra/events/factories/make-on-file-uploaded'
import { type FastifyInstance } from 'fastify'
import { uploadFileController } from '../controllers/upload-file'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function fileRoutes(app: FastifyInstance) {
  makeOnFileUploaded()

  app.post('/files', { onRequest: [verifyJwt], preHandler: [upload.single('file')] }, uploadFileController)
}
