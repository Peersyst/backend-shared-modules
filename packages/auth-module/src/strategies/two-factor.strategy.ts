import { Injectable, Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayloadDTOI } from "../dto/jwt-payload.dto";

@Injectable()
export class TwoFactorStrategy extends PassportStrategy(Strategy, "two-factor") {
    constructor(@Inject(ConfigService) configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("server.secretKey"),
        });
    }

    async validate(payload: JwtPayloadDTOI): Promise<{ email: string; id: number; type: string }> {
        if (payload.needs2fa && !payload.isTwoFactorAuthenticated) {
            throw new Error("Missing 2fa login");
        }
        return { email: payload.email, id: payload.id, type: payload.type };
    }
}
