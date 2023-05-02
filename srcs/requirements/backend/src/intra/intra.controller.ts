import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { IntraService } from './intra.service';
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
		try {
			const token : ApiData = await this.intraService.getToken();
			console.log("return de login : ", token);
			const user = await this.intraService.getUser();
			console.log("User : ", user);
			return user;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}