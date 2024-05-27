const hapi = require('@hapi/hapi')

const init = async() => {
  const server = hapi.server({
    port: 3000,
    host: "localhost"
  })

  await server.start()
  console.log(`Server running on ${server.info.uri}`)
}

init()