import { Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { SocketsGateway } from './sockets.gateway';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SocketsGateway, SocketsService],
})
export class SocketsModule {}
