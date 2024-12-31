import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useLocation, useNavigate } from "react-router-dom";

export default function Lobby() {
  const location = useLocation();
  const navigate = useNavigate();
  const roomName = location.state.roomName;
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on('players', (players) => {
      setPlayers(players);
    });

    return () => {
      socket.off('players');
    }
  }, []);

  function startGame() {
    socket.emit('');
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