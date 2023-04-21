import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendRequest } from '@prisma/client'

@Injectable()
export class FriendService {
    constructor(private prisma: PrismaService) { }

    async createFriendRequest(UserId: number, friendId: number): Promise<FriendRequest> {
        const request = await this.prisma.friendRequest.create({
            data: {
                sender: { connect: { id: UserId } },
                recipient: { connect: { id: friendId } }
            },
        });
        return request
    }

    async addFriend(userId: number, friendId: number): Promise<void> {
        const friend = await this.prisma.user.findUnique({
            where: { id: friendId },
        });
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!friend || !user) {
            throw new Error(`No user found with id ${friendId}`);
        }

        await this.prisma.friend.createMany({
            data: [
                { userId, friendId }, 
                {userId: friendId, friendId: userId}, 
            ]
        });
    }

    async acceptFriendRequest(UserId: number, friendId: number) {
        await this.prisma.friendRequest.deleteMany({
            where: {
                senderId: friendId,
                recipientId: UserId
            }
        })
        await this.addFriend(UserId, friendId)
        await this.addFriend(friendId, UserId)
    }

    async refuseFriendRequest(UserId: number, friendId: number) {
        await this.prisma.friendRequest.deleteMany({
            where: {
                senderId: friendId,
                recipientId: UserId
            }
        })
    }

    async getFriendsByUserId(userId: number) {
        return await this.prisma.friend.findMany({
            where: { userId },
            include: { user: true },
        })
    }

    async deleteFriendById(userId: number, friendId: number) {
        await this.prisma.friend.delete({
            where: {
                id: userId
            }
        })
        await this.prisma.friend.delete({
            where: {
                id: friendId
            }
        })
    }
}