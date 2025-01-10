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

    function onPlayers(players: Player[]) {
      console.log(players);
      setPlayers(players);
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
         {players.map((player: Player, index: any) => (
          <div key={index}>{player.name}</div>
         ))}
    </div>
  );
}