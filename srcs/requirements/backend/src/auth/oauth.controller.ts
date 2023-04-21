import { Body, Controller, Post } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import { OauthService } from "./oauth.service";

@Controller('oauth')
export class OauthController{
	constructor (private oauthService: OauthService) {}

	@Post('login')
	login(@Body() dto: AuthDto) {
		return this.oauthService.login(dto);
	}
}