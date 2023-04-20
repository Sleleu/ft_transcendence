import { Body, Controller, Get, NotFoundException, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

// si on met un controller (), il catch la root /
// Si on met une methode vide, elle catch la route du controller

interface AuthenticatedUser {
	id: number;
	username: string;
	elo: string;
}

interface AuthenticatedRequest extends Request {
	user: AuthenticatedUser;
}


@UseGuards(JwtGuard) // cette route est protegee par le guard de JwtStrategy
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('profile')
	getProfile(@Req() req: Request) {
		if (!req.user) {
			throw new NotFoundException('User not found');
		}
		console.log({ user: req.user })
		return (req.user);
	}

	@Put('update-username')
	async updateUsername(@Req() req: AuthenticatedRequest, @Body('newUsername') newUsername: string) {
		if (!req.user) {
			throw new NotFoundException('User not found');
		}
		console.log({ user: req.user })
		const id = req.user.id;
		return this.userService.updateUsername(id, newUsername);
	}

}

/* 
 Un guard se met a l'endpoint et permet ou non l'execution de cet endpoint.
 Ici le guard va check la strategy et si elle est correcte, il autorise la route
 On peut utiliser un guard au niveau global du module ou par route. on veut bloquer
 la route profile si on a pas le token
 strategy de passport-jwt dispose deja d'un guard
*/