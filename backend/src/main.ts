import cors from 'cors';
import express from 'express';
import http from 'http';
import * as socketio from 'socket.io';
import { Game, Player } from './game';
import roomRoutes from './routes/room-routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const rooms: {
  [key: string]: Game;
} = {};

app.get('/', (req, res) => {
  res.send({ uptime: process.uptime() });
});

roomRoutes(app, rooms);

const server = http.createServer(app);
const io = new socketio.Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: socketio.Socket) => {
  let room: string;
  console.log('User connected');

  socket.on('getRooms', () => {
    socket.emit('rooms', Object.keys(rooms));
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected');
  });

  socket.on('setName', (name: string) => {
    const player = rooms[room].getPlayer(socket.id);
    if (!player) {
      throw new Error('Player not found');
    }

    player.name = name;
  });

  socket.on('joinRoom', (joinRoom: string) => {
    room = joinRoom;
    socket.join(joinRoom);

    if (!rooms[joinRoom]) {
      rooms[joinRoom] = new Game(io, joinRoom);
    }

    if (rooms[joinRoom].started) {
      throw new Error('Game already started');
    }

    rooms[joinRoom].addPlayer(new Player('Player', socket));
  });

  socket.on('startGame', () => {
    if (!room) {
      throw new Error('Room not set');
    }
    rooms[room].start();
  });
});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});
