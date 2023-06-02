import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService,
        private jwtService: JwtService) { }

    async getAllUsers() {
        const users = await this.prismaService.user.findMany({
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

    async getUserFromToken(token: string) {
        console.log("Passage dans getProfile()")
        try {
            const decoded = this.jwtService.verify(token);
            if (!decoded) {
                return null;
            }

            const user = await this.prismaService.user.findUnique({
                where: {
                    id: decoded.userId,
                },
            });

            if (!user) {
                return null;
            }

            return {
                id: user.id,
                username: user.username,
                elo: user.elo,
            };
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateUsername(id: number, newUsername: string) {
        return this.prismaService.user.update({
            where: { id: id },
            data: { username: newUsername },
        })
    }

    async getBlock(userId: number) {
        const user = await this.prismaService.bloqueUser.findMany({
            where: { senderId: userId },
            include: { recipient: true }
        })
        return user
    }

    async deleteBlock(blockId: number) {
        await this.prismaService.bloqueUser.delete({
            where: { id: blockId }
        })
    }
}
