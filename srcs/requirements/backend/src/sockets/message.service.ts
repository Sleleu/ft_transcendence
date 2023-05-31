import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CreateRoomDto, MessageObj } from './entities/message.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Message } from '@prisma/client';

@Injectable()
export class MessageService {
  private clientToUser: { [clientId: string]: User } = {};

  constructor(private prisma: PrismaService) { }

  async searchUser(userName : string) {
    const user = await this.prisma.user.findUnique({
      where : {
        username : userName,
      },
    });
    return user;
  }

  async createRoom(dto: CreateRoomDto, userId: number) {
    const room = await this.prisma.room.create({
      data: {
        name: dto.name,
        type: dto.type,
        password: dto.password, //DEVRAIT ETRE UN HASH
        owner: { connect: { id: userId } },
      }
    })
    return room;
  }
  findAllRooms() {
    const rooms = this.prisma.room.findMany();
    return rooms;
  }
  async getRoomByName(roomName: string) {
    const room = await this.prisma.room.findFirst({
      where : {
        name: roomName,
      },
    });
    return room;
  }

  async addWhitelistUser(roomId: number, userId: number) {
    return this.prisma.room.update({
      where: { id: roomId },
      data: { whitelist: { connect: { id: userId } } },
    });
  }
  async searchWhiteList(roomId: number, userId: number) {
    const room = await this.prisma.room.findUnique({
      where : {id: roomId},
      include: { whitelist: true },
    });
    const isWhiteListed = room?.whitelist.some((user) => user.id === userId);
    return isWhiteListed;
  }

  async ban(roomId: number, userId: number) {
    return this.prisma.room.update({
      where: { id: roomId },
      data: { banned: { connect: { id: userId } } },
    });
  }
  async unban(roomId: number, userId: number) {
    return this.prisma.room.update({
      where: { id: roomId },
      data: { banned: { disconnect: { id: userId } } },
    });
  }
  async isBanned(roomId: number, userId: number) {
    const room = await this.prisma.room.findUnique({
      where : {id: roomId},
      include: { banned: true },
    });
    const ban = room?.banned.some((user) => user.id === userId);
    return ban;
  }

  async promoteAdmin(roomId: number, userId: number) {
    return this.prisma.room.update({
      where: { id: roomId },
      data: { admin: { connect: { id: userId } } },
    });
  }
  async demoteAdmin(roomId: number, userId: number) {
    return this.prisma.room.update({
      where: { id: roomId },
      data: { admin: { disconnect: { id: userId } } },
    });
  }
  async isAdmin(roomId: number, userId: number) {
    const room = await this.prisma.room.findUnique({
      where : {id: roomId},
      include: { admin: true },
    });
    const adm = room?.admin.some((user) => user.id === userId);
    return adm;
  }

  async createMessage(createMessageDto: CreateMessageDto, username: string) {
    const message = await this.prisma.message.create({
      data: {
        name: username,
        text: createMessageDto.text,
        room: { connect: { id: createMessageDto.room } },
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

}
