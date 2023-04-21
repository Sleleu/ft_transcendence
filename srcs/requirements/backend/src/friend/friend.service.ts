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

    async acceptFriendRequest(UserId: number, friendId: number) {
        await this.prisma.friendRequest.deleteMany({
            where: {
                senderId: friendId,
                recipientId: UserId
            }
        })
        await this.prisma.user.update({
            where: {id: UserId},
            data: {
                friends: {
                    connect: {
                        id: friendId
                    }
                }
            }
        })
    }

    async refuseFriendRequest(UserId: number, friendId: number) {
        await this.prisma.friendRequest.deleteMany({
            where: {
                senderId: friendId,
                recipientId: UserId
            }
        })
    }
}