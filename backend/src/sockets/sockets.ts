import * as socketio from 'socket.io';
import { Game } from '../game';
import { Player } from '../game';

export default function sockets(socket: socketio.Socket, io: socketio.Server, rooms: { [key: string]: Game }) {
  let room: string;
  console.log('User connected');

  socket.on('disconnect', async () => {
    console.log('User disconnected');
  });

  socket.on('joinRoom', (joinRoomData: {roomName: string; userName: string}) => {
    const joinRoom = joinRoomData.roomName;
    const userName = joinRoomData.userName;
    room = joinRoom;
    socket.join(joinRoom);

    if (!rooms[joinRoom]) {
      rooms[joinRoom] = new Game(io, joinRoom);
      io.emit('roomUpdate', joinRoom);
    }

    if (rooms[joinRoom].started) {
      throw new Error('Game already started');
    }

    rooms[joinRoom].addPlayer(new Player(userName, socket));
    // io.emit('roomUpdate', rooms[joinRoom].players);
  });

  socket.on('getRooms', () => {
    socket.emit('rooms', Object.keys(rooms));
  });

  socket.on('getPlayers', (roomName: string) => {
    if (!rooms[roomName]) {
      console.error("Room not found:", roomName);
      return;
    }
    const players = rooms[roomName].players.map((player) => ({
      name: player.name,
      dice: player.dice,
    }));
    console.log(players);
    io.in(roomName).emit('players', players);
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
