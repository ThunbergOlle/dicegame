import cors from 'cors';
import express from 'express';
import http from 'http';
import * as socketio from 'socket.io';
import { Game, Player } from './game';

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

app.get('/room/:id', (req, res) => {
        const room = req.params.id;
        res.send({ players: rooms[room].players });
})


const server = http.createServer(app);
const io = new socketio.Server(server, {
        cors: {
                origin: '*',
                methods: ['GET', 'POST'],
        },
});


const rooms: {
        [key: string]: Game
} = {}


io.on('connection', (socket) => {
        console.log('User connected');


        socket.on('disconnect', async () => {
                console.log('User disconnected');

        });

        socket.on('setName', (name) => {
                console.log('Name:', name);
        })

        socket.on('joinRoom', (room) => {
                socket.join(room);

                if (!rooms[room]) {
                        rooms[room] = new Game(io, room);
                }


                rooms[room].addPlayer(new Player('Player', socket));

        })

});

server.listen(4000, () => {
        console.log('Server listening on port 4000');
});
