import { FastifyReply, FastifyRequest } from "fastify"
import {Data} from '../../helper/interface'
import dayjs from 'dayjs'
 
export default async function(server: any, opts: any, next: any) {
    server.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
        try{
            await request.jwtVerify()
        }catch(err){
            reply.send(err)
        }
    })

    server.get('/:id', async (request: FastifyRequest<{Params:{id: number}, Querystring:{page: number,per_page: number}}>, reply: FastifyReply) => {
        let result = await server.redis.get('plants_'+request.params.id)
        if(result){
            return JSON.parse(result)
        }
        
        const skip = (request.query.page - 1) * request.query.per_page || 0
        const take = request.query.per_page || 30
        const plant = await server.prisma.shelves.findUnique({where: { id: +request.params.id }})
        server.redis.set('plants_'+request.params.id, JSON.stringify({plant:plant}))

        return {plant: plant}
    })

    server.post('/log', async (request: FastifyRequest<{Body:{master: Data,plants: Data[]}}>, reply: FastifyReply) => {
        let master = request.body.master
        let plants: Data[] = request.body.plants
        let house = await server.prisma.houses.findUnique({where: { id: master.house_id }})
        let houselog = await server.prisma.house_logs.findFirst({where: {AND: [
            {house_id: master.house_id},
            {created_at: {gte: new Date(new Date().setHours(0,0,0,0))}}
        ]},orderBy: {id: 'desc'}})
        if(!houselog){
            return {status: "required house log"}
        }
        
        plants.forEach(async (plantlog) => {
            let now = new Date()
            let created = new Date(plantlog.created_at)
            const today = dayjs().format('YYYY-MM-DD ')
            
            const plant = await server.prisma.plants.findUnique({where: { id: plantlog.id }})
            if(!plant){
                return {status: "plant not found"}
            }
            let age = Math.ceil((now.getTime() - created.getTime()) / (1000 * 3600 * 24))
            const data = {
                plant_id: plantlog.id,
                shelf_id: master.shelf_id,
                house_id: master.house_id,
                temperature: plantlog.temperature,
                humidity: plantlog.humidity,
                co2: plantlog.co2,
                light_start: today+houselog.light_start,
                light_stop: today+houselog.light_stop,
                light_intensity: houselog.light_intensity,
                water_ph: houselog.water_ph,
                water1_rate: houselog.water1_rate / house.plant_total,
                water1_start: houselog.water1_start,
                water1_stop: houselog.water1_stop,
                water2_rate: houselog.water2_rate / house.plant_total,
                water2_start: houselog.water2_start,
                water2_stop: houselog.water2_stop,
                status: plantlog.status,
                problem: plantlog.problem,
                action: plantlog.action,
                images: null,
                age: age 
            }
            const log = await server.prisma.plant_logs.upsert({
                where: {house_id: master.house_id,created_at: {gte: dayjs().format('YYYY-MM-DD 00:00:00')}},
                create: data,
                update: data
            })
        })
        
        
        
        return {status: "log created"}
    })
}