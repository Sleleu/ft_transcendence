import { Body, Controller, Get, Post } from '@nestjs/common';
import { IntraService } from './intra.service';
import { ApiData } from './intra.interface';

@Controller('intra')
export class IntraController {
	constructor (private intraService: IntraService) {}

	@Get('login')
	async login() {
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