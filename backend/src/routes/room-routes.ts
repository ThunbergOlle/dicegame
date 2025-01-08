import { Express } from "express";

export default function roomRoutes(app: Express, rooms: { [key: string]: any }) {
  app.get('/rooms', (_req, res) => {
    res.send(Object.keys(rooms));
  });

  app.get('/room/:id', (req, res) => {
    const room = req.params.id;
    res.send({ players: rooms[room].players });
  });

}