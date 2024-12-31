import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useLocation } from "react-router-dom";

export default function Lobby() {
  const location = useLocation();
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

  return (
    <div>
      <h1>{roomName}</h1>
      {players.map((player) => (
        <div key={player}>{player["name"]}</div>
      ))}
    </div>
  );
}