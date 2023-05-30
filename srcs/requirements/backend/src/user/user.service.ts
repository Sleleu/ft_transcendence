import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService,
				private jwtService: JwtService) {}

				// async getUsers() {
				// 	const users = await this.prisma.user.findMany({
				// 		select: {
				// 			id: true,
				// 			state: true,
				// 			username: true,
				// 			elo: true,
				// 			win: true,
				// 			loose: true,
				// 		}
				// 	});
				// 	return users;
				// }

	async getUserFromToken(token : string) {
		//console.log("Passage dans getProfile()")
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

    async updateGameLogin(id: number, gameLogin: string) {
        console.log("test dans update username", id, gameLogin);
    
        const existingUser = await this.prismaService.user.findFirst({
            where: { id: id }
        });
        if(!existingUser){
            throw new HttpException('No user found with given id', 404);
        }
        if(existingUser.gameLogin === gameLogin){
            throw new HttpException('New username is same as the old username', 400);
        }
        if (gameLogin.length < 5 || gameLogin.length > 30) {
            throw new HttpException('Game login must have between 5 and 30 characters', 400);
        }
        const validCharacters = /^[a-zA-Z0-9_-]+$/
        if (!validCharacters.test(gameLogin)) {
            throw new HttpException('Game login can only contain alphanumeric characters, hyphens and underscores', 400);
        }
        const usernameTaken = await this.prismaService.user.findFirst({
            where: { gameLogin: gameLogin }
        });
        if(usernameTaken){
            throw new HttpException('Game login is already taken by another user', 400);
        }
        return this.prismaService.user.update({
            where: {id: id},
            data: { gameLogin: gameLogin},
        })
    }
    

}
