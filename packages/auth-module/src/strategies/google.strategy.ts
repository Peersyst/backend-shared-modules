import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { Inject, Injectable } from "@nestjs/common";
import { ThirdPartyUserDtoI } from "../dto/third-party-user.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(@Inject(ConfigService) configService: ConfigService) {
        super({
            clientID: configService.get("googleAuth.clientId"),
            clientSecret: configService.get("googleAuth.clientSecret"),
            callbackURL: configService.get("server.baseUrl") + "/api/auth/google/callback",
            scope: ["email", "profile"],
        });
    }

    async validate(accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
        const { name, emails } = profile;
        const user: ThirdPartyUserDtoI = {
            email: emails[0].value,
            name: name.givenName,
            accessToken,
        };
        done(null, user);
    }
}
