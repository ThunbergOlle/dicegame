import cors from 'cors';
import express from 'express';
import http from 'http';
import * as socketio from 'socket.io';
import { rooms } from './rooms';
import { roomRouter } from './routes/room-routes';
import sockets from './sockets/sockets';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(roomRouter);

app.get('/', (req, res) => {
  res.send({ uptime: process.uptime() });
});

const server = http.createServer(app);
const io = new socketio.Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: socketio.Socket) => {
  sockets(socket, io, rooms);
});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});
