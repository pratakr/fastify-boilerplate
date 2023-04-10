import fp from 'fastify-plugin'
import minio from 'fastify-minio'

const minioPlugin = fp(async (server, options) => {
    server.register(minio, {
        endPoint: process.env.MINIO_ENDPOINT || 'localhost',
        port: process.env.MINIO_PORT || 9000,
        useSSL: true,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY
    })
})

export default minioPlugin