import { FastifyReply, FastifyRequest } from "fastify"

export default async function(server: any, opts: any, next: any) {
    server.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
        try{
            await request.jwtVerify()
        }catch(err){
            reply.send(err)
        }
    })

    server.get('/:id', async (request: FastifyRequest<{Params:{id: number}, Querystring:{page: number,per_page: number}}>, reply: FastifyReply) => {
        let result = await server.redis.get('shelves_'+request.params.id)
        if(result){
            return JSON.parse(result)
        }
        
        const skip = (request.query.page - 1) * request.query.per_page || 0
        const take = request.query.per_page || 30
        const shelf = await server.prisma.shelves.findUnique({where: { id: +request.params.id }})
        server.redis.set('shelves_'+request.params.id, JSON.stringify({shelf:shelf}))
        return {shelf: shelf}
    })

    server.post('/:id/log', async (request: FastifyRequest<{Params:{id: number}, Body:{house_id: number, user_id: number, action: string}}>, reply: FastifyReply) => {
        const log = await server.prisma.shelves_log.create({
            data: {
                house_id: request.body.house_id,
                user_id: request.body.user_id,
                action: request.body.action
            }
        })
        return {log: log}
    })
}