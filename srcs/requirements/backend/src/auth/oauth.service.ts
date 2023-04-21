import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class OauthService {
	constructor (private prisma: PrismaService) {}

	async login(dto: AuthDto)
	{
		return (console.log("login test"));
	}

}