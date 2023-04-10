import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

const jwtPlugin = fp(async (server, options) => {
    await server.register(jwt, {
        secret: "kanchan",
        sign: {
            expiresIn: '24h'
        }
    })

    // server.addHook('onRequest', async (request, reply) => {
    //     try{
    //         await request.jwtVerify()
    //     }catch(err){
    //         reply.send(err)
    //     }
    // })
})

export default jwtPlugin