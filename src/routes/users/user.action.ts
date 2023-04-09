import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import bcrypt from 'bcrypt'

// const UserRoutes: FastifyPluginAsync = fp(async (server, options) => {
//     server.get('/users', async (request, reply) => {
//         const users = await server.prisma.users.findMany({skip:0,take:30})
//         return {users: users}
//     })

//     server.get('/users/:id', async (request: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply) => {
//         const user = await server.prisma.users.findUnique({where: { id: BigInt(request.params.id) }})
//         return {user: user}
//     })
// })

export default async function(server: any, opts: any, next: any) {
    server.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
        try{
            await request.jwtVerify()
        }catch(err){
            reply.send(err)
        }
    })

    server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        const users = await server.prisma.users.findMany({skip:0,take:30})
        return {users: users}
    })

    server.get('/:id', async (request: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply) => {
        const user = await server.prisma.users.findUnique({where: { id: BigInt(request.params.id) }})
        return {user: user}
    })
}
