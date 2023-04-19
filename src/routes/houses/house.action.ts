import { FastifyReply, FastifyRequest } from "fastify"
import { Data } from "../../helper/interface"
import dayjs from "dayjs"

export default async function(server: any, opts: any, next: any) {
    server.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
        try{
            await request.jwtVerify()
        }catch(err){
            reply.send(err)
        }
    })

    server.get('/', async (request: FastifyRequest<{Querystring:{page: number,per_page: number}}>, reply: FastifyReply) => {
        const skip = (request.query.page - 1) * request.query.per_page || 0
        const take = request.query.per_page || 30
        const houses = await server.prisma.houses.findMany({skip: skip,take:take})
        return {houses: houses}
    })

    server.post('/:id/log',async (request: FastifyRequest<{Params: {id: number}, Body: Data}>, reply: FastifyReply) => {
        const house = await server.prisma.houses.findUnique({where: { id: +request.params.id }})
        if(!house){
            reply.code(404)
            return {message: "House not found"}
        }

        const today = dayjs().format('YYYY-MM-DDT')
        const log = await server.prisma.house_logs.create({data: {
            house_id: +request.params.id,
            temperature: request.body.temperature,
            humidity: request.body.humidity,
            co2: request.body.co2,
            light_intensity: request.body.light_intensity,
            light_start: new Date(today+request.body.light_start+":00Z"),
            light_stop: new Date(today+request.body.light_stop+":00Z"),
            water_ph: request.body.water_ph,
            water1_rate: request.body.water1_rate,
            water2_rate: request.body.water2_rate,
            water1_start: new Date(today+request.body.water1_start+":00Z"),
            water1_stop: new Date(today+request.body.water1_stop+":00Z"),
            water2_start: new Date(today+request.body.water2_start+":00Z"),
            water2_stop: new Date(today+request.body.water2_stop+":00Z"),
            }})
        return {log: log}
    })
}