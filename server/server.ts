import express, {Express, Request, Response} from 'express'
import http from 'http'
import {Server, Socket} from 'socket.io'
import cors from 'cors'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {cors: {origin: "*"}});


app.use(cors());

  io.on('connection', (socket) => {
    console.log(socket.id)
  });


const port = 8000

server.listen(port, () => {
    console.log(`server running on port ${port}`)
})