import { Module } from '@nestjs/common';
import { FriendController } from './friend.controler'

@Module({
    controllers: [FriendController]
})

export class FriendModule { }