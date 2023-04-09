import tp from 'fastify-plugin'
import cors from '@fastify/cors'

const corsPlugin = tp(async (server, options) => {
    await server.register(cors, {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
})

export default corsPlugin