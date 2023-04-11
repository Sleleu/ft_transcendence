import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController{
	constructor(private authService: AuthService) {}

	@Get('signup')
	signup(@Body() dto: AuthDto) {
		console.log({
			dto,
		});
		return this.authService.signup();
	}


	@Post('signin')
	signin() {
		return this.authService.signin();
	}
}