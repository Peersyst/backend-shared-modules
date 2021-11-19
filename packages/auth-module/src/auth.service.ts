import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrivateAuthUserDtoI } from "./dto/private-user.dto";
import { AuthCredentialsDtoI } from "./dto/auth-credentials.dto";
import { AuthType, ThirdPartyUserDtoI } from "./dto/third-party-user.dto";

export interface AuthUserServiceI {
    userEmailPasswordMatch: (email: string, password: string) => Promise<PrivateAuthUserDtoI>;
    findOrCreate?: (thirdPartyUser: ThirdPartyUserDtoI, authType: AuthType) => Promise<PrivateAuthUserDtoI>;
}
export interface ThirdPartyUserServiceI {
    userEmailPasswordMatch: (email: string, password: string) => Promise<PrivateAuthUserDtoI>;
    findOrCreate: (thirdPartyUser: ThirdPartyUserDtoI, authType: AuthType) => Promise<PrivateAuthUserDtoI>;
}

@Injectable()
export class AuthService {
    constructor(
        @Inject("UserService") private readonly userService: AuthUserServiceI | ThirdPartyUserServiceI,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<PrivateAuthUserDtoI | null> {
        return await this.userService.userEmailPasswordMatch(email, pass);
    }

    async login(user: PrivateAuthUserDtoI): Promise<AuthCredentialsDtoI> {
        const payload = { email: user.email, id: user.id, type: user.type };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async googleLogin(googleUser: ThirdPartyUserDtoI): Promise<AuthCredentialsDtoI> {
        const user: PrivateAuthUserDtoI = await this.userService.findOrCreate(googleUser, AuthType.GOOGLE);
        return this.login(user);
    }

    async twitterLogin(twitterUser: ThirdPartyUserDtoI): Promise<AuthCredentialsDtoI> {
        const user: PrivateAuthUserDtoI = await this.userService.findOrCreate(twitterUser, AuthType.TWITTER);
        return this.login(user);
    }
}
