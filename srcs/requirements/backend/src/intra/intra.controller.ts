import { Body, Controller, Get, Post, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { IntraService } from './intra.service';
import { Response } from 'express';
import { ApiData } from './intra.interface';
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
			const AccessToken : ApiToken = await this.intraService.getProfile(AccessToken);
			const Profile = await this.intraService.getProfile(AccessToken);
			if (!Profile){
				throw new HttpException('Cannot get Profile from getProfile()', HttpStatus.FORBIDDEN);
			}
			res.redirect(this.configService.get('RESPONSE_URI'));
	}
}