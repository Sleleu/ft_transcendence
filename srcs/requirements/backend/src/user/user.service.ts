import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async updateUsername(id: number, newUsername: string) {
        return this.prisma.user.update({
            where: {id: id},
            data: { username: newUsername},
        })
    }

}
