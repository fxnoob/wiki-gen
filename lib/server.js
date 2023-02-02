const express = require('express')
const serveStatic = require('serve-static')

const serveStaticContent = (dirPath, port) => {
    const portNumber = port || 8000
    const app = express()
    app.use(serveStatic(dirPath, { index: ['index.html', 'default.html'] }))
    const server = app.listen(portNumber, '0.0.0.0', ()=> {
        console.log(`Docs are at: http://localhost:${portNumber}`)
    })
    process.on('SIGINT', function () {
        server.close()
    })
}

exports.serve = serveStaticContent
