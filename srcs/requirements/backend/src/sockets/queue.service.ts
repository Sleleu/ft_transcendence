import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CreateRoomDto, MessageObj } from './entities/message.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Message } from '@prisma/client';

@Injectable()
export class QueueService {
    constructor(private prisma: PrismaService) { }
    private stack: number[] = []
    private stackBonus: number[] = []

    addToStack(id: number): number[] | undefined {
        this.stack.push(id);
        if (this.stack.length >= 2) {
            const ids = this.stack.splice(0, 2);
            return ids;
        }

        return undefined;
    }

    quitQueue(id: number): void {
        const index = this.stack.indexOf(id);
        if (index !== -1) {
            this.stack.splice(index, 1);
        }
    }

    quitQueueBonus(id: number): void {
        const index = this.stackBonus.indexOf(id);
        if (index !== -1) {
            this.stackBonus.splice(index, 1);
        }
    }

    addToStackBonus(id: number): number[] | undefined {
        this.stackBonus.push(id);
        if (this.stackBonus.length >= 2) {
            const ids = this.stackBonus.splice(0, 2);
            return ids;
        }

        return undefined;
    }

    async retUser(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: id }
        })
        if (user)
            return {
                username: user.gameLogin,
                id: user.id
            }
    }
}
