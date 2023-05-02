import { Controller, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { IntraService } from './intra.service';
import { Response } from 'express';
import { ApiToken } from './intra.interface';
import { ConfigService } from '@nestjs/config';

@Controller('intra')
export class IntraController {
	constructor (private intraService: IntraService,
				 private configService: ConfigService) {}

	@Get('callback')
	async getCode(@Query('code') code : string,
				  @Query('state') state : string,
				  @Res() res : Response) {
			if (state !== this.configService.get('STATE') || !code) {
				throw new HttpException('Invalid code or state', HttpStatus.FORBIDDEN);
			}
			const AccessToken : ApiToken = await this.intraService.getToken(code);
			const Profile = await this.intraService.getProfile(AccessToken);
			if (!Profile){
				throw new HttpException('Cannot get Profile from getProfile()', HttpStatus.FORBIDDEN);
			}
			return `Profile : ${Profile.login}`;
	}
}