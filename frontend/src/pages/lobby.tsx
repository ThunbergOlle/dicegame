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
  const [players, setPlayers] = useState<Array<Player>>([]);

  useEffect(() => {
    socket.emit('getPlayers');

    function onPlayers(players: Array<Player>) {
      setPlayers(players);
    }

    socket.on('players', () => {
      setPlayers(players);
    });

    return () => {
      socket.off('players');
    }
  }, []);

  function startGame() {
    socket.emit('startGame');
    navigate('/lobby/game');
  }

  return (
    <div>
      <h1>{roomName}</h1>
      <button onClick={() => startGame()}>Start Game</button>
      <h2>Players:</h2>
      {players.map((player) => (
        <div key={player}>{player["name"]}</div>
      ))}
    </div>
  );
}