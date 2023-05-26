import { Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { SocketsGateway } from './sockets.gateway';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'process';
import { FriendController } from 'src/friend/friend.controler';
import { FriendModule } from 'src/friend/friend.module';
import { FriendService } from 'src/friend/friend.service';

@Module({
  imports: [JwtModule.register({ secret: 'transcendence_secret' }), FriendModule],
  providers: [SocketsGateway, SocketsService, FriendService]
})
export class SocketsModule { }
