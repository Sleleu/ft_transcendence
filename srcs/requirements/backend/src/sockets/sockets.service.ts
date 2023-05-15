import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CreateRoomDto, MessageObj } from './entities/message.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from '@prisma/client';

@Injectable()
export class SocketsService {
  private clientToUser: { [clientId: string]: string } = {};

  constructor(private prisma: PrismaService) { }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  async createRoom(dto: CreateRoomDto) {
    const room = await this.prisma.room.create({
      data : {
        name: dto.name,
        type: dto.type,
        password: dto.password, //DEVRAIT ETRE UN HASH
        owner: {connect: {id: dto.userId}},
      }
    })
    return room;
  }
  findAllRooms() {
    const rooms = this.prisma.room.findMany();
    return rooms;
  }

  async addWhitelistUser(roomId: number, userId: number) {
    return this.prisma.room.update({
      where: { id: roomId },
      data: { whitelist: { connect: { id: userId } } },
    });
  }

  async createMessage(createMessageDto: CreateMessageDto,) {
    const message = await this.prisma.message.create({
      data : {
        name: createMessageDto.name,
        text: createMessageDto.text,
        room: {connect: {id:createMessageDto.room}},
      }
    })
    return message;
  }

  async getMessagesByRoom(roomId: number): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
    });
  }
  
  findAll() {
    const messages = this.prisma.message.findMany();
    return messages;
  }

}
