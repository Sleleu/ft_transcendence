import { ForbiddenException, Injectable } from '@nestjs/common';
import { HistoryDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryService {
    constructor(private prisma: PrismaService) {}

    async newEntry(dto: HistoryDto) {
        const id: number = parseInt(dto.userID);
        const user = await this.prisma.user.findUnique({where : {id : id}})
        if (!user)
            throw new ForbiddenException('User does not exist');
        const entry = {
            user: user,
            userId: user.id,
            result: dto.result,
            mode: dto.mode,
            pointsWon: dto.pointsWon,
            pointsLost: dto.pointsLost,
            elo: dto.elo,
        }
        return user;
    }
}
