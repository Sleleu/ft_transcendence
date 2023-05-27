import { Body, Controller, ForbiddenException, Get, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { TwofaService } from './twofa.service';

@Controller('twofa')
export class TwofaController {

    constructor (private twofaService: TwofaService,
                 private prismaService: PrismaService) {}

	@Get('generate-2fa-secret')
	async generateTwoFASecret(@Req() req : Request) {
  	const sessionId = req.cookies.Authorization;
  	const user = await this.prismaService.user.findFirst({
    	where: {
      	access_token: sessionId
    	},
  	});
	console.log('Passage dans generate et user = ', user);
  	if (!user) {
    	throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
  	}
  	const otpauthUrl = await this.twofaService.generateTwoFactorAuthenticationSecret(user.username, user.id);
	const qrcode = await this.twofaService.generateQrCodeDataURL(otpauthUrl)
	
	return qrcode;
	}

	@Post('verify-2fa-code')
	async verifyTwoFACode(@Req() req : Request, @Body('code') code : string) {
	const sessionId = req.cookies.Authorization;
	const user = await this.prismaService.user.findFirst({
		where: {
		access_token: sessionId
		},
	});

	if (!user) {
		throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
	}
	console.log('2FA code = ', code)
	const isTwoFAValid = await this.twofaService.verifyTwoFactorAuthenticationToken(user.id, code);
	if (isTwoFAValid) {
		return true;
	} else {
		throw new ForbiddenException('Invalid 2FA code');
	}
	}

	@Post('enable-2fa')
	async enableTwoFA(@Req() req : Request) {
		const sessionId = req.cookies.Authorization;
		const user = await this.prismaService.user.findFirst({
			where: {
				access_token: sessionId
			},
		});
		if (!user) {
			throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
		}
		await this.twofaService.enableTwoFA(user.id);
		return { message: "2FA enabled successfully" };
	}

	@Post('disable-2fa')
	async disableTwoFA(@Req() req : Request) {
		const sessionId = req.cookies.Authorization;
		const user = await this.prismaService.user.findFirst({
			where: {
				access_token: sessionId
			},
		});
		if (!user) {
			throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
		}
		await this.twofaService.disableTwoFA(user.id);
		return { message: "2FA disabled successfully" };
	}

	@Get('check-2fa')
	async checkTwoFA(@Req() req : Request) {
		const sessionId = req.cookies.Authorization;
		const user = await this.prismaService.user.findFirst({
			where: {
				access_token: sessionId
			},
		});
		if (!user) {
			throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
		}
		return await this.twofaService.isTwoFAEnabled(user.id);
	}

	@Get('check-2fa-verified')
	async isTwoFAVerified(@Req() req : Request) {
		const sessionId = req.cookies.Authorization;
		const user = await this.prismaService.user.findFirst({
			where: {
				access_token: sessionId
			},
		});
		if (!user) {
			throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
		}
		return await this.twofaService.isTwoFAVerified(user.id);
	}

	@Post('enable-2fa-verified')
	async enableTwoFAVerified(@Req() req : Request) {
		const sessionId = req.cookies.Authorization;
		const user = await this.prismaService.user.findFirst({
			where: {
				access_token: sessionId
			},
		});
		if (!user) {
			throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
		}
		await this.twofaService.enableTwoFAVerified(user.id);
		return { message: "2FAVerified is set to true" };
	}

	@Post('disable-2fa-verified')
	async disableTwoFAVerified(@Req() req : Request) {
		const sessionId = req.cookies.Authorization;
		const user = await this.prismaService.user.findFirst({
			where: {
				access_token: sessionId
			},
		});
		if (!user) {
			throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
		}
		await this.twofaService.disableTwoFAVerified(user.id);
		return { message: "2FAVerified is set to false" };
	}  
}
