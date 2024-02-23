export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
  size: number
}

export interface Uploader {
  upload: (params: UploadParams) => Promise<{ key: string }>
}
