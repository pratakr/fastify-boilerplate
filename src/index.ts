import fastify from 'fastify'
import autoload from '@fastify/autoload'
import path from 'path'

const server = fastify({logger: true})

server.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
})

server.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    routeParams: true
})

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})