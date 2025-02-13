import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useLocation, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface Player {
  name: string;
  socket: Socket;
  dice: [number, number, number, number, number];
}

export default function Lobby() {
  const location = useLocation();
  const navigate = useNavigate();
  const roomName = location.state.roomName;
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    socket.emit('getPlayers', roomName);

    function onPlayers(recievedPlayers: Player[]) {
      console.log("Recieved Players: ", recievedPlayers);
      if (recievedPlayers && recievedPlayers.length > 0) {
        setPlayers(recievedPlayers);
      }
      else{
        console.log("No recieved Players");
      }
    }

    socket.on('players', onPlayers);

    return () => {
      socket.off('players', onPlayers);
    }
  }, []);

  function startGame() {
    socket.emit('startGame');
    navigate('/game');
  }

  return (
    <div>
      <h1>{roomName}</h1>
      <button onClick={() => startGame()}>Start Game</button>
      <h2>Players:</h2>
      {players.length > 0 ? (
        players.map((player, index) => (
          <div key={player.name + index}>
            <p>{player.name}</p>
          </div>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}