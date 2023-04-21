import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { IntraService } from './intra.service';

@Controller('intra')
export class IntraController {
	constructor (private intraService: IntraService) {}

	@Get('login')
	login() {
		return this.intraService.login();
	}
}