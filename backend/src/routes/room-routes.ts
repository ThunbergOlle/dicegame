import { Router } from 'express';
import { rooms } from '../rooms';

export const roomRouter = Router();
roomRouter.get('/rooms', (_req, res) => {
  res.send(Object.keys(rooms));
});

roomRouter.get('/room/:id', (req, res) => {
  const room = req.params.id;
  res.send({ players: rooms[room].players });
});

