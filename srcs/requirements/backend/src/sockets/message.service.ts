import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CreateRoomDto, MessageObj } from './entities/message.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Message, Room } from '@prisma/client';

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

  async owner(roomName : string) {
    const room = await this.prisma.room.findFirst({
      where : {
        name : roomName,
      },
    });
    if (!room)
      throw new ForbiddenException('Room not found');
    const owner = await this.prisma.user.findUnique({
      where : { 
        id : room.ownerId,
      },
    });
    return owner;
  }

  async connectedUser(roomId: number, userId: number)
  {
    return this.prisma.room.update({
      where: { id: roomId },
      data: { connected: { connect: { id: userId } } },
    });
  }
  async disconnectedUser(roomId: number, userId: number)
  {
    return this.prisma.room.update({
      where: { id: roomId },
      data: { connected: { disconnect: { id: userId } } },
    });
  }
  async isConnected(roomId: number, userId: number) {
    const room = await this.prisma.room.findUnique({
      where : {id: roomId},
      include: { connected: true },
    });
    const isConnected = room?.connected.some((user) => user.id === userId);
    return isConnected;
  }
  async getConnected(roomId: number) {
    const rooms = await this.prisma.room.findUnique({
      where : {id: roomId},
      include: { connected: true },
    });
    return rooms?.connected;
  }

  async createRoom(dto: CreateRoomDto, userId: number) {
    const room = await this.prisma.room.create({
      data: {
        name: dto.name,
        type: dto.type,
        password: dto.password, //DEVRAIT ETRE UN HASH
        owner: { connect: { id: userId } },
      }
    });
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
  async getWhiteList(roomId: number) {
    const rooms = await this.prisma.room.findUnique({
      where : {id: roomId},
      include: { whitelist: true },
    });
    return rooms?.whitelist;
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

  async mute(roomId: number, userId: number) {
    return this.prisma.room.update({
      where: { id: roomId },
      data: { muted: { connect: { id: userId } } },
    });
  }
  async unmute(roomId: number, userId: number) {
    return this.prisma.room.update({
      where: { id: roomId },
      data: { muted: { disconnect: { id: userId } } },
    });
  }
  async isMuted(roomId: number, userId: number) {
    const room = await this.prisma.room.findUnique({
      where : {id: roomId},
      include: { muted: true },
    });
    const mute = room?.muted.some((user) => user.id === userId);
    return mute;
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

  async getMessagesByRoom(roomId: number) {
  const messages = this.prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
    });
    return messages;
  }
}
