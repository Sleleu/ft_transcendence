import { Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { SocketsGateway } from './sockets.gateway';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'process';

@Module({
  imports: [JwtModule.register({secret: 'transcendence_secret' })],
  providers: [SocketsGateway, SocketsService]
})
export class SocketsModule {}