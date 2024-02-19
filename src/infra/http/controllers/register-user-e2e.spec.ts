import { app } from '@/infra/app'

describe('Register user (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a new user', () => {
    /*
    We are short on time, so e2e tests will be implemented after the presentation of the TCC
    */
  })
})
