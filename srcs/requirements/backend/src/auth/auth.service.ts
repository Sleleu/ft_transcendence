import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService{

	constructor(private prisma: PrismaService) {}	
	login() {

	}

	async signup(dto: AuthDto) {
		// generer le hash
		const hash = await argon.hash(dto.password);
		// save the new user in the db
		try {
			const user = await this.prisma.user.create({
				data: {
					username: dto.username,
					hash
				},
			});
			
			// return the saved user
			return (user);
			} catch (error) {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === 'P2002') {
						throw new ForbiddenException('Username already taken');
					}
				}
			}
	}

	signin() {
		return ({msg: 'I have signed in'});
	}
}