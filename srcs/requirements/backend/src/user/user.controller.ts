import { Body, Controller, Get, NotFoundException, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

interface AuthenticatedUser {
	id: number;
	username: string;
}

interface AuthenticatedRequest extends Request {
	user: AuthenticatedUser;
}

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('profile')
	async getProfile(@Req() req: AuthenticatedRequest) {
		if (!req.user) {
			throw new NotFoundException('User not found');
		}
		return (req.user);
	}

	@Get('logout')
	logout(@Res() res: Response) {
	  res.clearCookie('Authorization');
	  return res.status(200).send({ message: 'User logged out' });
	}

	@Put('update-gameLogin')
	async updategGameLogin(@Req() req: AuthenticatedRequest, @Body('gameLogin') gameLogin: string) {
		if (!req.user) {
			throw new NotFoundException('User not found');
		}
		console.log({ user: req.user }) 
		const id = req.user.id;
		return this.userService.updateGameLogin(id, gameLogin);
	}
}
