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
  startGame(): void{
    console.log("in socketgatway start game")
    return this.messagesService.startGame();
  }

  @SubscribeMessage('pause')
  pauseGame(): void{
    console.log("in socketgatway pause game")
    return this.messagesService.pauseGame();
  }

  @SubscribeMessage('reset')
  resetGame(): void{
    console.log("in socketgatway reset game")
    return this.messagesService.resetGame();
  }

  @SubscribeMessage('move-player')
	movePlayer(@MessageBody() movePlayerDto: MovePlayerDto): void{
		return this.messagesService.movePlayer(movePlayerDto);
	}

  @SubscribeMessage('move-opponent')
	moveOpponent(@MessageBody() moveOpponentDto: MoveOpponentDto): void{
		return this.messagesService.moveOpponent(moveOpponentDto);
	}

  @SubscribeMessage('bounceBall')
	bounceBall(@MessageBody() bounceBallDto: BounceBallDto): void{
		return this.messagesService.bounceBall(bounceBallDto);
	}
}
