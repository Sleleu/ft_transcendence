import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {Server, Socket} from 'socket.io';
import { GameState, BounceBallDto } from './dto/game.dto';


@WebSocketGateway({cors : true})
export class SocketsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: SocketsService) {}

  afterInit() {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    client.on('gameStateUpdate', (gameState: GameState) => {

      console.log("handleconnection");
    });
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    console.log("Message Received by server : ", createMessageDto);
    const message = await this.messagesService.create(createMessageDto);

    this.server.emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllMessages')
    findAll() {
    const messages = this.messagesService.findAll();
    return messages;
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody('name') name:string, @ConnectedSocket() client: Socket) {
    return this.messagesService.identify(name, client.id);
  }

  @SubscribeMessage('typing')
  async typing(@MessageBody('isTyping') isTyping: boolean, @ConnectedSocket() client: Socket) {
    const name = await this.messagesService.getClientName(client.id);
    client.broadcast.emit('typing', { name, isTyping });
  }

  @SubscribeMessage('start')
  startGame(@ConnectedSocket() client: Socket): void{
    console.log("in socketgatway start game")
    this.messagesService.startGame();
    client.emit('start');
  }

  @SubscribeMessage('pause')
  pauseGame(@ConnectedSocket() client: Socket): void{
    console.log("in socketgatway pause game")
    this.messagesService.pauseGame();
    client.emit('pause');
  }

  @SubscribeMessage('reset')
  resetGame(@ConnectedSocket() client: Socket): void{
    console.log("in socketgatway reset game")
    this.messagesService.resetGame();
    client.emit('reset');
  }

  @SubscribeMessage('bounceBall')
  bounceBall(@MessageBody() bounceBallDto: BounceBallDto,  @ConnectedSocket() client: Socket): void{
    this.messagesService.bounceBall(bounceBallDto);
    console.log("server side: bounce ball gateway")
    client.emit('bounceBall', this.messagesService.getGameState());
  }

  @SubscribeMessage('move-player')
	movePlayer(@MessageBody() movePlayer: number[], @ConnectedSocket() client: Socket): void{
		this.messagesService.movePlayer(movePlayer);
    client.emit('move-player', this.messagesService.getGameState().player);
  }

  @SubscribeMessage('move-opponent')
	moveOpponent(@MessageBody() moveOpponent: number[], @ConnectedSocket() client: Socket): void{
		this.messagesService.moveOpponent(moveOpponent);
    client.emit('move-opponent', this.messagesService.getGameState());
  }

  @SubscribeMessage('moveBall')
  moveBall(@ConnectedSocket() client: Socket): void{
    console.log("server side: moveBall event");

  }

  @SubscribeMessage('score')
  score(@ConnectedSocket() client: Socket): void{
    console.log("server side: score event");
    this.messagesService.getGameState().playerScore++;
    client.emit('score', this.messagesService.getGameState());
  }

}
