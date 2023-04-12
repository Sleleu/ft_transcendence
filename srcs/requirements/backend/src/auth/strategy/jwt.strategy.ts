import { Injectable, Req } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	
	constructor(config: ConfigService, prisma: PrismaService) {
	super({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: config.get('JWT_SECRET')
	})
	}

	validate(payload: any) {
		req.user
		return (payload);
	}
}