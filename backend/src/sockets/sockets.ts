import * as socketio from 'socket.io';
import { Game } from '../game';
import { Player } from '../game';

export default function sockets(socket: socketio.Socket, io: socketio.Server, rooms: { [key: string]: Game }) {
  let room: string;
  console.log('User connected');

  socket.on('disconnect', async () => {
    console.log('User disconnected');
  });

  socket.on('joinRoom', (joinRoom: string) => {
    room = joinRoom;
    socket.join(joinRoom);

    if (!rooms[joinRoom]) {
      rooms[joinRoom] = new Game(io, joinRoom);
      io.emit('roomUpdate', joinRoom);
    }

    if (rooms[joinRoom].started) {
      throw new Error('Game already started');
    }

    rooms[joinRoom].addPlayer(new Player('Player', socket));
  });

  socket.on('getRooms', () => {
    socket.emit('rooms', Object.keys(rooms));
  });

  socket.on('setName', (name: string) => {
    const player = rooms[room].getPlayer(socket.id);
    if (!player) {
      throw new Error('Player not found');
    }

    player.name = name;
  });

  socket.on('startGame', () => {
    if (!room) {
      throw new Error('Room not set');
    }
    rooms[room].start();
  });
}
