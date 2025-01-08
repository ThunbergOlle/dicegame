import roomRoutes from './room-routes';
import { Express } from 'express';

export default function routes(app: Express, rooms: { [key: string]: any }) {
  app.get('/', (req, res) => {
    res.send({ uptime: process.uptime() });
  });

  roomRoutes(app, rooms);
}