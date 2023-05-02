import { Controller, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { IntraService } from './intra.service';
import { Response } from 'express';
import { ApiToken, User42 } from './intra.interface';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('intra')
export class IntraController {
	constructor (private intraService: IntraService,
				 private configService: ConfigService,
				 private prismaService: PrismaService) {}

	@Get('callback')
	async getCode(@Query('code') code : string,
				  @Query('state') state : string,
				  @Res() res : Response) {
			if (state !== this.configService.get('STATE') || !code) {
				throw new HttpException('Invalid code or state', HttpStatus.FORBIDDEN);
			}
			const AccessToken : ApiToken = await this.intraService.getToken(code);
			if (!AccessToken.access_token) {
				throw new HttpException('Cannot get access token from 42 api', HttpStatus.FORBIDDEN);
			}
			const Profile = await this.intraService.getProfile(AccessToken);
			if (!Profile){
				throw new HttpException('Cannot get Profile from getProfile()', HttpStatus.FORBIDDEN);
			}
			const NewUser : boolean = await this.intraService.newProfile(Profile);
			if  (NewUser == true){
				await this.intraService.createUser(Profile);
			}
			console.log("Profile intra after callback : ", Profile);
			return console.log("Success !");
	}
}