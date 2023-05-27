import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {Server, Socket} from 'socket.io';
import { GameState, MovePlayerDto, MoveOpponentDto, BounceBallDto } from './dto/game.dto';


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
    client.emit('start', this.messagesService.getGameState().pause);
  }

  @SubscribeMessage('pause')
  pauseGame(@ConnectedSocket() client: Socket): void{
    console.log("in socketgatway pause game")
    this.messagesService.pauseGame();
    client.emit('pause', this.messagesService.getGameState());
  }

  @SubscribeMessage('reset')
  resetGame(@ConnectedSocket() client: Socket): void{
    console.log("in socketgatway reset game")
    this.messagesService.resetGame();
    client.emit('reset', this.messagesService.getGameState());
  }

  @SubscribeMessage('move-player')
	movePlayer(@MessageBody() movePlayerDto: MovePlayerDto, @ConnectedSocket() client: Socket): void{
		this.messagesService.movePlayer(movePlayerDto);
    client.emit('move-player', this.messagesService.getGameState());
  }

  @SubscribeMessage('move-opponent')
	moveOpponent(@MessageBody() moveOpponentDto: MoveOpponentDto, @ConnectedSocket() client: Socket): void{
		this.messagesService.moveOpponent(moveOpponentDto);
    client.emit('move-opponent', this.messagesService.getGameState());
  }

  @SubscribeMessage('bounceBall')
	bounceBall(@MessageBody() bounceBallDto: BounceBallDto,  @ConnectedSocket() client: Socket): void{
		this.messagesService.bounceBall(bounceBallDto);
    client.emit('bounceBall', this.messagesService.getGameState());
  }

  @SubscribeMessage('moveBall')
  moveBall(@ConnectedSocket() client: Socket): void{
    console.log("server side: moveBall event");

  }
}
