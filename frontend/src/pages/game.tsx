import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Game() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on('players', (players) => {
      setPlayers(players);
    });

    return () => {
      socket.off('players');
    }
  }, []);

  return (
    <div>
      <h1>Game</h1>
      {players.map((player) => (
        <div key={player}>{player["name"]}</div>
      ))}
    </div>
  );
}