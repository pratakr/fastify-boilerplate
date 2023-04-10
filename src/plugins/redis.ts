import fp from 'fastify-plugin'

const redisPlugin = fp(async (server, options) => {
    server.register(require('@fastify/redis'), {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || '',
        db: process.env.REDIS_DB || 0
    })
})
export default redisPlugin