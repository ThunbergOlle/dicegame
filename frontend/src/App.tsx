import { useEffect, useState } from 'react'
import { socket } from './socket'
import './App.css'

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [rooms, setRooms] = useState([])

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

  function joinRoom() {
    socket.emit('joinRoom', 'room1');
  }

  function getRooms() {
    socket.emit('getRooms');
  }

  function createRoom() {
    // Create a new room
    let room = prompt('Enter room name');

    if (room) {
      socket.emit('joinRoom', room);
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
          <li onClick={() => console.log("test")} style={{ cursor: 'pointer' }}>
            {room}
          </li>
        ))}
      </div>
    </>
  )
}

export default App
