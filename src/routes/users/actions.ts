import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

const UserRoutes: FastifyPluginAsync = fp(async (server, options) => {
    server.get('/', async (request, reply) => {
        const users = await server.prisma.users.findMany()
        return {users: users}
    })
})

export default UserRoutes