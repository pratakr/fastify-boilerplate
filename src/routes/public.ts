import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import bcrypt from 'bcrypt'

export default async function(server: any, opts: any, next: any) {
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
            let token = await server.jwt.sign({id: user.id, email: user.email, role_id: user.role_id})
            return {token: token}
        }
    })
}