import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Home() {
  const [rooms, setRooms] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit('getRooms');

    function onRooms(rooms: string[]) {
      setRooms(rooms);
    }

    function onRoomUpdate(room: string) {
      setRooms((rooms) => [...rooms, room]);
    }

    socket.on('rooms', onRooms);
    socket.on('roomUpdate', onRoomUpdate);

    return () => {
      socket.off('rooms', onRooms);
      socket.off('roomUpdate', onRoomUpdate);
    };
  }, []);

  function joinRoom(roomName: string) {
    const userName = prompt('Enter your name');
    if (!userName) {
      return;
    }
    socket.emit('joinRoom', { roomName, userName } );
    navigate('/lobby', { state: { roomName, userName } });
  }

  function getRooms() {
    socket.emit('getRooms');
  }

  function createRoom() {
    const room = prompt('Enter room name');

    if (room) {
      joinRoom(room);
    }
  }

  return (
    <>
      <h1>Dice Game</h1>
      <button onClick={createRoom}>Create Room</button>
      <div className="rooms">
        {rooms.map((room) => (
          <li onClick={() => joinRoom(room)} style={{ cursor: 'pointer' }} key={room}>
            {room}
          </li>
        ))}
      </div>
      <footer>Completely original game by OsbyGamingInc.AB ©️</footer>
    </>
  );
}
