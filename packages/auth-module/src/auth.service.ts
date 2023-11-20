import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrivateAuthUserDtoI } from "./dto/private-user.dto";
import { AuthCredentialsDtoI } from "./dto/auth-credentials.dto";
import { AuthType, ThirdPartyUserDtoI } from "./dto/third-party-user.dto";
import { BusinessException } from "./exception/business.exception";
import { AuthErrorCode } from "./exception/error-codes";

export interface AuthUserServiceI {
    userEmailPasswordMatch: (email: string, password: string) => Promise<PrivateAuthUserDtoI | null>;
    findById: (userId: number) => Promise<PrivateAuthUserDtoI>;
    findOrCreate?: (thirdPartyUser: ThirdPartyUserDtoI, authType: AuthType) => Promise<PrivateAuthUserDtoI>;
    updateUserValidated?: (userId: number) => Promise<PrivateAuthUserDtoI>;
    findByEmail?: (email: string) => Promise<PrivateAuthUserDtoI | null>;
    resetPassword?: (userId: number, password: string) => Promise<void>;
}
export interface ThirdPartyUserServiceI {
    userEmailPasswordMatch: (email: string, password: string) => Promise<PrivateAuthUserDtoI | null>;
    findById: (userId: number) => Promise<PrivateAuthUserDtoI>;
    findOrCreate: (thirdPartyUser: ThirdPartyUserDtoI, authType: AuthType) => Promise<PrivateAuthUserDtoI>;
    updateUserValidated?: (userId: number) => Promise<PrivateAuthUserDtoI>;
    findByEmail?: (email: string) => Promise<PrivateAuthUserDtoI | null>;
    resetPassword?: (userId: number, password: string) => Promise<void>;
}
export interface ValidateEmailUserServiceI {
    userEmailPasswordMatch: (email: string, password: string) => Promise<PrivateAuthUserDtoI>;
    findById: (userId: number) => Promise<PrivateAuthUserDtoI>;
    findOrCreate?: (thirdPartyUser: ThirdPartyUserDtoI, authType: AuthType) => Promise<PrivateAuthUserDtoI>;
    updateUserValidated: (userId: number) => Promise<PrivateAuthUserDtoI>;
    findByEmail?: (email: string) => Promise<PrivateAuthUserDtoI | null>;
    resetPassword?: (userId: number, password: string) => Promise<void>;
}
export interface RecoverPasswordUserServiceI {
    userEmailPasswordMatch: (email: string, password: string) => Promise<PrivateAuthUserDtoI>;
    findById: (userId: number) => Promise<PrivateAuthUserDtoI>;
    findOrCreate?: (thirdPartyUser: ThirdPartyUserDtoI, authType: AuthType) => Promise<PrivateAuthUserDtoI>;
    updateUserValidated?: (userId: number) => Promise<PrivateAuthUserDtoI>;
    findByEmail: (email: string) => Promise<PrivateAuthUserDtoI | null>;
    resetPassword: (userId: number, password: string) => Promise<void>;
}

@Injectable()
export class AuthService {
    constructor(
        @Inject("UserService")
        private readonly userService: AuthUserServiceI | ThirdPartyUserServiceI | ValidateEmailUserServiceI | RecoverPasswordUserServiceI,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<PrivateAuthUserDtoI> {
        let user;
        try {
            user = await this.userService.userEmailPasswordMatch(email, pass);
        } catch (error) {
            throw new BusinessException(AuthErrorCode.INVALID_CREDENTIALS);
        }

        if (!user) {
            throw new BusinessException(AuthErrorCode.INVALID_CREDENTIALS);
        }
        if (user.blocked) {
            throw new BusinessException(AuthErrorCode.BLOCKED_USER);
        }
        if (user.emailVerified === false) {
            throw new BusinessException(AuthErrorCode.EMAIL_NOT_VERIFIED);
        }

        return user;
    }

    async userDeletedOrBlocked(userId: number): Promise<{ deleted: boolean; blocked: boolean }> {
        const resp = { deleted: false, blocked: false };

        try {
            const user = await this.userService.findById(userId);
            if (!user) {
                resp.deleted = true;
            } else {
                resp.blocked = !!user.blocked;
            }
        } catch (err) {
            resp.deleted = true;
        }

        return resp;
    }

    async login(user: PrivateAuthUserDtoI): Promise<AuthCredentialsDtoI> {
        const payload = { email: user.email, id: user.id, type: user.type };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async changePassword(user: PrivateAuthUserDtoI, currentPassword: string, newPassword: string): Promise<AuthCredentialsDtoI> {
        await this.validateUser(user.email, currentPassword);
        await this.userService.resetPassword(user.id, newPassword);
        return this.login(user);
    }

    async validateUserEmail(userId: number): Promise<AuthCredentialsDtoI> {
        const user = await this.userService.updateUserValidated(userId);
        return this.login(user);
    }

    async getUserByEmail(email: string): Promise<PrivateAuthUserDtoI> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new BusinessException(AuthErrorCode.USER_NOT_FOUND);
        }
        return user;
    }

    async resetPassword(userId: number, password: string): Promise<void> {
        await this.userService.resetPassword(userId, password);
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
