import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-twitter";
import { Inject, Injectable } from "@nestjs/common";
import { ThirdPartyUserDtoI } from "../dto/third-party-user.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, "twitter") {
    constructor(@Inject(ConfigService) configService: ConfigService) {
        super({
            consumerKey: configService.get("twitterAuth.apiKey"),
            consumerSecret: configService.get("twitterAuth.apiKeySecret"),
            callbackURL: configService.get("server.baseUrl") + "/api/auth/twitter/callback",
            //This and the "Request email address from users" option are required in order to retreive the user email
            userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
            scope: ["email", "profile"],
        });
    }

    async validate(accessToken: string, _tokenSecret: string, profile: Profile, done: (error: any, user?: any) => void): Promise<any> {
        const { displayName, emails } = profile;
        const user: ThirdPartyUserDtoI = {
            email: emails[0].value,
            name: displayName,
            accessToken,
        };
        done(null, user);
    }
}
