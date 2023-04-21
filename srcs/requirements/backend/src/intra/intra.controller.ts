import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { IntraService } from './intra.service';

@Controller('intra')
export class IntraController {
	constructor (private intraService: IntraService) {}

	@Post('login')
	login(@Body() dto: AuthDto) {
		return this.intraService.login(dto);
	}
}