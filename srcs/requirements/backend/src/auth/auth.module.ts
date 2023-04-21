import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { OauthController } from "./oauth.controller";
import { OauthService } from "./oauth.service";

@Module({
	imports: [JwtModule.register({})],
	controllers: [AuthController, OauthController],
	providers: [AuthService, JwtStrategy, OauthService],
})
export class AuthModule {}