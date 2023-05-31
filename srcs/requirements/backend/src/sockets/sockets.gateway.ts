import { WebSocketGateway, OnGatewayInit, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {Server, Socket} from 'socket.io';
import { GameState, BounceBallDto } from './dto/game.dto';
import { Interval } from '@nestjs/schedule';


@WebSocketGateway({cors : true})
export class SocketsGateway implements OnGatewayInit{
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: SocketsService) {}

  afterInit() {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @Interval(16)
  updateGameStateInterval(): void{
	  console.log("inside the interval on the server side");
	  if (!this.messagesService.getGameState().pause){
      this.messagesService.bounceBall();
      this.server.emit("updateBallPosition", this.messagesService.getGameState());
	  }
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
    this.server.emit('start');
  }

  @SubscribeMessage('pause')
  pauseGame(@ConnectedSocket() client: Socket): void{
    console.log("in socketgatway pause game")
    this.messagesService.pauseGame();
    this.server.emit('pause');
  }

  @SubscribeMessage('reset')
  resetGame(@ConnectedSocket() client: Socket): void{
    console.log("in socketgatway reset game")
    this.messagesService.resetGame();
    this.server.emit('reset');
  }

  @SubscribeMessage('updateBallPosition')
  bounceBall(@MessageBody() bounceBallDto: BounceBallDto,  @ConnectedSocket() client: Socket): void{
    this.messagesService.updateBallPosition(bounceBallDto);
    console.log("server side: bounce ball gateway emitting from: ", client.id);
    this.server.emit('updateBallPosition', this.messagesService.getGameState());
  }

  @SubscribeMessage('move-player')
	movePlayer(@MessageBody() movePlayer: number[], @ConnectedSocket() client: Socket): void{
		// console.log("server side: move-player");
    this.messagesService.movePlayer(movePlayer);
    client.broadcast.emit('move-opponent', this.messagesService.getGameState());
  }

  // @SubscribeMessage('move-opponent')
	// moveOpponent(@MessageBody() moveOpponent: number[], @ConnectedSocket() client: Socket): void{
	// 	this.messagesService.moveOpponent(moveOpponent);
  //   this.server.emit('move-opponent', this.messagesService.getGameState());
  // }

  // @SubscribeMessage('score')
  // score(@ConnectedSocket() client: Socket): void{
  //   console.log("server side: score event");
  //   this.messagesService.getGameState().playerScore++;
  //   client.emit('score', this.messagesService.getGameState());
  // }

}
