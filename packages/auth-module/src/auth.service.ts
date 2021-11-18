import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrivateUserDto } from "./dto/private-user.dto";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { AuthType, ThirdPartyUserDto } from "./dto/third-party-user.dto";

export interface UserServiceInterface {
    userEmailPasswordMatch: (email: string, password: string) => Promise<PrivateUserDto>;
    // Required for 3rd party login
    findOrCreate?: (thirdPartyUser: ThirdPartyUserDto, authType: AuthType) => Promise<PrivateUserDto>;
}

@Injectable()
export class AuthService {
    constructor(
        @Inject("UserService") private readonly userService: UserServiceInterface,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<PrivateUserDto | null> {
        return await this.userService.userEmailPasswordMatch(email, pass);
    }

    async login(user: PrivateUserDto): Promise<AuthCredentialsDto> {
        const payload = { email: user.email, id: user.id, type: user.type };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async googleLogin(googleUser: ThirdPartyUserDto): Promise<AuthCredentialsDto> {
        const user: PrivateUserDto = await this.userService.findOrCreate(googleUser, AuthType.GOOGLE);
        return this.login(user);
    }

    async twitterLogin(twitterUser: ThirdPartyUserDto): Promise<AuthCredentialsDto> {
        const user: PrivateUserDto = await this.userService.findOrCreate(twitterUser, AuthType.TWITTER);
        return this.login(user);
    }
}
