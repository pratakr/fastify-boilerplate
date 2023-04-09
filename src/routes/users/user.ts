import fp from 'fastify-plugin'
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
    server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        const users = await server.prisma.users.findMany({skip:0,take:30})
        return {users: users}
    })

    server.get('/:id', async (request: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply) => {
        const user = await server.prisma.users.findUnique({where: { id: BigInt(request.params.id) }})
        return {user: user}
    })

    server.post('/login', async (request: FastifyRequest<{Body: {email: string, password: string}}>, reply: FastifyReply) => {
        const user = await server.prisma.users.findUnique({where: { email: request.body.email }})
        if(!user){
            reply.code(401)
            return {message: "Invalid credentials"}
        }

        const valid = await bcrypt.compare(request.body.password, user.password)
        if(!valid){
            reply.code(401)
            return {message: "Invalid credentials"}
        }else{
            let token = await server.jwt.sign({id: user.id})
            return {token: token}
        }
    })
}
