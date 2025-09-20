import * as Minio from 'minio'

export default defineEventHandler(async (event) => {
  if (event.context.minio) {
    return
  }

  const minio = new Minio.Client({
    accessKey: process.env.MINIO_ACCESS_KEY,
    endPoint: process.env.MINIO_PUBLIC_HOST!,
    port: Number(process.env.MINIO_PUBLIC_PORT),
    secretKey: process.env.MINIO_SECRET_KEY,
  })

  event.context.minio = minio
})
