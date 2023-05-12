import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageObj } from './entities/message.entity';
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

  async create(createMessageDto: CreateMessageDto) {
    const message = await this.prisma.message.create({
      data : {
        name: createMessageDto.name,
        text: createMessageDto.text,
      }
    })
    return message;
  }

  findAll() {
    const messages = this.prisma.message.findMany();
    return messages;
  }

}
