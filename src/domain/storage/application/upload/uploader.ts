export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
  size: number
  storedAt: Date
}

export interface Uploader {
  upload: (params: UploadParams) => Promise<{ key: string }>
}
