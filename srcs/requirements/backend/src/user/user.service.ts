import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    async getUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                state: true,
                username: true,
                elo: true,
                win: true,
                loose: true,
            }
        });
        return users;
    }
}