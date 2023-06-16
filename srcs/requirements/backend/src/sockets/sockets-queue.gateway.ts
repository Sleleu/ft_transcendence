import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';
import { QueueService } from './queue.service';

@WebSocketGateway({ cors: true })
export class SocketsQueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    afterInit() {
    }

    handleConnection(client: Socket) {
    }

    handleDisconnect(client: Socket) {
    }

    constructor(
        private readonly socketService: SocketsService,
        private readonly queueService: QueueService) { }

    @SubscribeMessage('addQueuen')
    async addQueue(@ConnectedSocket() client: Socket) {
        const user = await this.socketService.getUser(client.id);
        if (!user)
            return ;
        const stack = this.queueService.addToStack(user.id)
        if (stack) {
            if (stack[0] === user.id)
                await this.send(client, stack, 1, 0)
            else
                await this.send(client, stack, 0, 1)
        }
    }

    @SubscribeMessage('addQueueb')
    async addQueueBonus(@ConnectedSocket() client: Socket) {
        const user = await this.socketService.getUser(client.id);
        if (!user)
            return ;
        const stack = this.queueService.addToStackBonus(user.id)
        if (stack) {
            if (stack[0] === user.id)
                await this.send(client, stack, 1, 0)
            else
                await this.send(client, stack, 0, 1)
        }
    }

    async send(client: Socket, stack: number[], userIndex: number, vsIndex: number) {
        const opponent = await this.queueService.retUser(stack[userIndex])
        client.emit('vsName', { opponent: opponent })
        // const friendSocketId = this.socketService.findSocketById(stack[userIndex])
        // if (friendSocketId) {
        //     const friendSocket = this.server.sockets.sockets.get(friendSocketId)
        //     if (friendSocket) {
        //         const Opponent = await this.queueService.retUser(stack[vsIndex])
        //         friendSocket.emit('vsName', { opponent: Opponent })
        //     }
        // }

        const Opponent = await this.queueService.retUser(stack[vsIndex]);
        if (Opponent)
            this.server.to(`user_${stack[userIndex]}`).emit('vsName', { opponent: Opponent })
    }

    @SubscribeMessage('quitQueuen')
   async quitQueue(@ConnectedSocket() client: Socket) {
        const user = await this.socketService.getUser(client.id)
        if (!user)
            return ;
        this.queueService.quitQueue(user.id)
    }

    @SubscribeMessage('quitQueueb')
   async quitQueueBonus(@ConnectedSocket() client: Socket) {
        const user = await this.socketService.getUser(client.id)
        if (!user)
            return ;
        this.queueService.quitQueueBonus(user.id)
    }
}