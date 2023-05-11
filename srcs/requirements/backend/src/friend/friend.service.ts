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
                userId: userId,
                friendId: friendId
            }
        })
        await this.prisma.friend.deleteMany({
            where: {
                userId: friendId,
                friendId: userId
            }
        })
    }

    async userByName(userId: number, name: string) {
        const friend = await this.prisma.user.findMany({
            where: {
                username: {
                    startsWith: name,
                }
            }
        })
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { friend: true }
        })
        const alreadyReq = await this.prisma.friendRequest.findMany({
            where : {senderId : userId },
            include : {recipient: true}
        })

        const filtered = friend.filter((friend) => friend.id !== userId && !user?.friend.some((f) => f.friendId === friend.id) && !alreadyReq?.some((req) => req.recipientId === friend.id))
        return filtered.map(friend => {
            const { hash, ...rest } = friend
            return friend
        })
    }

    async getFriendReq(userId: number) {
        const request = await this.prisma.friendRequest.findMany({
            where: { recipientId: userId },
            include: { sender: true }
        })
        return request.map(sender => {
            const { hash, ...rest } = sender.sender
            return { ...sender, sender: rest }
        })
    }
}
