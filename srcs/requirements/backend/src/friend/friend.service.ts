import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendRequest } from '@prisma/client'

@Injectable()
export class FriendService {
    constructor(private prisma: PrismaService) { }

    async createFriendRequest(UserId: number, friendId: number): Promise<FriendRequest> {
        const isAlreadyFriend = await this.prisma.friend.findMany({
            where: { userId: UserId, friendId: friendId }
        })

        if (isAlreadyFriend.length) {
            console.log('isFriend', isAlreadyFriend)
            throw new Error(`user ${UserId} is already friend with ${friendId}`);
        }

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

        await this.prisma.friend.create({
            data: {
                user: { connect: { id: friendId } },
                friend: { connect: { id: userId } },
            }
        })
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
        const friend = await this.prisma.friend.findMany({
            where: { userId },
            include: { friend: true },
        })
        return friend.map(friend => {
            const { hash, ...rest } = friend.friend
            return { ...friend, friend: rest }
        })
    }

    async deleteFriendById(userId: number, friendId: number) {
        await this.prisma.friend.deleteMany({
            where: {
                userId: userId
            }
        })
        await this.prisma.friend.deleteMany({
            where: {
                userId: friendId
            }
        })
    }
}