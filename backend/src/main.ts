import cors from 'cors';
import express from 'express';
import http from 'http';
import * as socketio from 'socket.io';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (_req, res) => {
        res.send({ uptime: process.uptime(), });
});

const server = http.createServer();
const io = new socketio.Server(server, {
        cors: {
                origin: '*',
                methods: ['GET', 'POST'],
        },
});

io.on('connection', (socket) => {
        socket.on('disconnect', async () => {
                console.log('User disconnected:');


        });

});

server.listen(4000, () => {
        console.log('Server listening on port 4000');
});

