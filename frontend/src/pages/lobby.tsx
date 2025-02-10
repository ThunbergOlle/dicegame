import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useLocation, useNavigate } from "react-router-dom";

interface Player {
  name: string;
  dice: [number, number, number, number, number];
}

export default function Lobby() {
  const location = useLocation();
  const navigate = useNavigate();
  const roomName = location.state.roomName;
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    socket.emit('getPlayers');

    function onPlayers(recievedPlayers: Player[]) {
      console.log("Excisting Players: ", players);
      console.log("Recieved Players: ", recievedPlayers);
      setPlayers((players) => [...players, ...recievedPlayers]);
    }

    socket.on('players', onPlayers);

    return () => {
      socket.off('players', onPlayers);
      console.log("retunred playtes: ", players);
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
      {players.map((player) => (
        <div key={player.name}>
          <p>{player.name}</p>
        </div>
      ))}
    </div>
  );
}