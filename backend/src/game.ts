import { Server as SocketIOServer, Socket } from 'socket.io';

const rollDice = () => Math.floor(Math.random() * 6) + 1;

export class Player {
  name: string;
  socket: Socket;
  dice: [number, number, number, number, number];

  constructor(name: string, socket: Socket) {
    this.name = name;
    this.dice = [1, 1, 1, 1, 1];
    this.socket = socket;
  }

  roll() {
    this.dice = [rollDice(), rollDice(), rollDice(), rollDice(), rollDice()];

    this.socket.emit('dice', this.dice);
  }
}
type GameRound = {
  currentPlayer: string;
  diceValue: number;
  diceCount: number;
};

export class Game {
  public players: Array<Player>;
  private server: SocketIOServer;
  private roomName: string;

  public round: GameRound;
  started: boolean = false;

  constructor(server: SocketIOServer, roomName: string) {
    this.players = [];
    this.round = {
      currentPlayer: '',
      diceValue: 0,
      diceCount: 0,
    };
    this.server = server;
    this.roomName = roomName;
  }

  addPlayer(player: Player) {
    this.players.push(player);

    this.server.to(this.roomName).emit(
      'players',
      this.players.map((player) => player.name),
    );
  }

  removePlayer(socketId: string) {
    this.players = this.players.filter((player) => player.socket.id !== socketId);

    this.server.to(this.roomName).emit(
      'players',
      this.players.map((player) => player.name),
    );
  }

  getPlayer(socketId: string) {
    return this.players.find((player) => player.socket.id === socketId);
  }

  nextRound() {
    this.players.forEach((player) => player.roll());

    this.round.currentPlayer = this.players[0].name;
    this.round.diceValue = 0;
    this.round.diceCount = 0;

    this.server.to(this.roomName).emit('round', this.round);
  }

  nextPlayer() {
    const currentPlayerIndex = this.players.findIndex((player) => player.name === this.round.currentPlayer);

    if (currentPlayerIndex === this.players.length - 1) {
      this.round.currentPlayer = this.players[0].name;
    } else {
      this.round.currentPlayer = this.players[currentPlayerIndex + 1].name;
    }

    this.server.to(this.roomName).emit('round', this.round);
  }

  start() {
    this.started = true;
    this.server.to(this.roomName).emit('startGame');

    sleep(1000).then(this.nextRound);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
