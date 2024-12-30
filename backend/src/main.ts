import cors from 'cors';
import express from 'express';
import http from 'http';
import * as socketio from 'socket.io';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
        res.send({ uptime: process.uptime(), });
});

app.get('/rooms', (_req, res) => {
        res.send({ rooms });
})


const server = http.createServer(app);
const io = new socketio.Server(server, {
        cors: {
                origin: '*',
                methods: ['GET', 'POST'],
        },
});

type Player = {
        name: string;
        socketId: string;
        dice: [number, number, number, number, number]
        //health: number
}

const rooms: { [key: string]: { players: Player[] } } = {}



io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('getRooms', () => {
                socket.emit('rooms', Object.keys(rooms));
        });

        socket.on('disconnect', async () => {
                console.log('User disconnected');

        });

        socket.on('setName', (name) => {
                console.log('Name:', name);
        })
        socket.on('joinRoom', (room) => {
                if (!rooms[room]) {
                        rooms[room] = { players: [] }
                }

                rooms[room].players.push({
                        name: 'Player',
                        socketId: socket.id,
                        dice: [0, 0, 0, 0, 0]
                })

                socket.join(room);
        })
});

server.listen(4000, () => {
        console.log('Server listening on port 4000');
});
