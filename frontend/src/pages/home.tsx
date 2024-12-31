import { useEffect, useState } from 'react'
import { socket } from '../socket'
import { useNavigate } from 'react-router-dom'
import "../App.css"

export default function Home() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [rooms, setRooms] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }
    socket.on('connect', onConnect);

    getRooms();
    socket.on('rooms', (rooms) => {
      setRooms(rooms);
    });

    return () => {
      socket.off('connect', onConnect);
    }
  }, [])

  function joinRoom(roomName: string) {
    socket.emit('joinRoom', roomName);
    navigate('/game');
  }

  function getRooms() {
    socket.emit('getRooms');
  }

  function createRoom() {
    let room = prompt('Enter room name');

    if (room) {
      joinRoom(room);
    }
  }

  return (
    <>
      <h1>Dice Game</h1>
      <button onClick={createRoom}>
        Create Room
      </button>
      <div className="rooms">
        {rooms.map((room) => (
          <li onClick={() => joinRoom(room)} style={{ cursor: 'pointer' }} key={room}>
            {room}
          </li>
        ))}
      </div>
      <footer>Completely original game by OsbyGamingInc.AB</footer>
    </>
  )
}

