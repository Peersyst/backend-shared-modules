import { Body, Controller, Post, Request, UseGuards, Get, Response, Inject } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ApiErrorDecorators } from "./exception/error-response.decorator";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { BusinessException } from "./exception/business.exception";
import { AuthErrorCode } from "./exception/error-codes";
import { ThirdPartyUserDtoI } from "./dto/third-party-user.dto";
import { TwitterAuthGuard } from "./guards/twitter-auth.guard";
import { ConfigService } from "@nestjs/config";
import { ValidateEmailRequest, ResetPasswordRequest, LoginRequest } from "./requests";
import { ValidateEmailService } from "./validate-email.service";
import { RecoverPasswordRequest } from "./requests/recover-password.request";
import { RecoverPasswordService } from "./recover-password.service";
import { PrivateAuthUserDtoI } from "./dto/private-user.dto";
import { RefreshVerificationTokenRequest } from "./requests/refresh-verification-code.request";
import { Authenticated } from "./auth.decorator";
import { ChangePasswordRequest } from "./requests/change-password.request";

@ApiTags("authenticate")
@Controller("auth")
@ApiErrorDecorators()
export class AuthController {
    constructor(private readonly authService: AuthService, @Inject(ConfigService) private configService: ConfigService) {}

    @ApiOperation({ summary: "Authenticate user with email" })
    @UseGuards(LocalAuthGuard)
    @Post("login")
    @ApiException(() => new BusinessException(AuthErrorCode.INVALID_CREDENTIALS))
    @ApiOkResponse({ type: AuthCredentialsDto })
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async login(@Body() loginRequestDto: LoginRequest, @Request() req): Promise<AuthCredentialsDto> {
        const accessToken = await this.authService.login(req.user);
        return accessToken;
    }

    @ApiOperation({ summary: "Change password" })
    @Authenticated()
    @Post("change-password")
    @ApiException(() => new BusinessException(AuthErrorCode.INVALID_CREDENTIALS))
    @ApiOkResponse({ type: AuthCredentialsDto })
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async changePassword(@Body() changePasswordRequest: ChangePasswordRequest, @Request() req): Promise<AuthCredentialsDto> {
        const credentials = await this.authService.changePassword(
            req.user,
            changePasswordRequest.currentPassword,
            changePasswordRequest.newPassword,
        );
        return credentials;
    }
}

@ApiTags("authenticate")
@Controller("auth/google")
@ApiErrorDecorators()
export class AuthGoogleController {
    constructor(private readonly authService: AuthService, @Inject(ConfigService) private configService: ConfigService) {}

    @ApiOperation({ summary: "Authenticate user with Google" })
    @UseGuards(GoogleAuthGuard)
    @Get("")
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async googleAuth(): Promise<void> {}

    @ApiOperation({ summary: "Google auth callback" })
    @UseGuards(GoogleAuthGuard)
    @Get("callback")
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async googleAuthRedirect(@Request() req, @Response() res) {
        if (!req.user) {
            throw new BusinessException(AuthErrorCode.USER_NOT_FOUND);
        }
        const user: ThirdPartyUserDtoI = req.user;
        const { access_token } = await this.authService.googleLogin(user);
        res.cookie("access_token", access_token, { expires: new Date(Date.now() + 60000) });
        res.redirect(this.configService.get("server.frontUrl"));
    }
}

@ApiTags("authenticate")
@Controller("auth/twitter")
@ApiErrorDecorators()
export class AuthTwitterController {
    constructor(private readonly authService: AuthService, @Inject(ConfigService) private configService: ConfigService) {}

    @ApiOperation({ summary: "Authenticate user with Twitter" })
    @UseGuards(TwitterAuthGuard)
    @Get("")
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async twitterAuth(): Promise<void> {}

    @ApiOperation({ summary: "Twitter auth callback" })
    @UseGuards(TwitterAuthGuard)
    @Get("callback")
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async twitterAuthRedirect(@Request() req, @Response() res) {
        if (!req.user) {
            throw new BusinessException(AuthErrorCode.USER_NOT_FOUND);
        }
        const user: ThirdPartyUserDtoI = req.user;
        const { access_token } = await this.authService.twitterLogin(user);
        res.cookie("access_token", access_token, { expires: new Date(Date.now() + 60000) });
        res.redirect(this.configService.get("server.frontUrl"));
    }
}

@ApiTags("authenticate")
@Controller("auth")
@ApiErrorDecorators()
export class AuthValidateController {
    constructor(private readonly authService: AuthService, private readonly validateEmailService: ValidateEmailService) {}

    @Post("verify-email")
    @ApiException(() => new BusinessException(AuthErrorCode.TOKEN_NOT_FOUND))
    @ApiException(() => new BusinessException(AuthErrorCode.TOKEN_ALREADY_VERIFIED))
    @ApiOperation({ summary: "Verify user email" })
    @ApiOkResponse({ type: AuthCredentialsDto })
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async verifyEmail(@Body() validateEmailRequest: ValidateEmailRequest): Promise<AuthCredentialsDto> {
        const tokenData = await this.validateEmailService.verifyEmailVerificationToken(validateEmailRequest.token);
        const accessToken = await this.authService.validateUserEmail(tokenData.userId);
        return accessToken;
    }

    @Post("verificationToken/")
    @ApiException(() => new BusinessException(AuthErrorCode.USER_NOT_FOUND))
    @ApiOperation({ summary: "Resend email verification" })
    async resendEmailVerification(@Body() refreshVerificationToken: RefreshVerificationTokenRequest): Promise<void> {
        await this.validateEmailService.createEmailVerificationToken(refreshVerificationToken.userId);
    }
}

export interface RecoverNotificationServiceI<TSource = any> {
    notificateRecoverPassword: (user: PrivateAuthUserDtoI, resetToken: string, source: TSource) => Promise<void>;
}

@ApiTags("authenticate")
@Controller("auth")
@ApiErrorDecorators()
export class AuthRecoverController {
    constructor(
        private readonly authService: AuthService,
        private readonly recoverPasswordService: RecoverPasswordService,
        @Inject("NotificationService") private readonly notificationService: RecoverNotificationServiceI,
    ) {}

    @Post("recover-password")
    @ApiException(() => new BusinessException(AuthErrorCode.USER_NOT_FOUND))
    @ApiOkResponse()
    @ApiOperation({ summary: "Request Password Reset" })
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars
    async requestResetPassword<TSource>(@Body() recoverPasswordRequest: RecoverPasswordRequest<TSource>): Promise<void> {
        const user = await this.authService.getUserByEmail(recoverPasswordRequest.email);
        const resetToken = await this.recoverPasswordService.createResetToken(user.id);
        await this.notificationService.notificateRecoverPassword(user, resetToken, recoverPasswordRequest.source);
    }

    @Post("reset-password")
    @ApiException(() => new BusinessException(AuthErrorCode.TOKEN_NOT_FOUND))
    @ApiException(() => new BusinessException(AuthErrorCode.TOKEN_EXPIRED))
    @ApiOkResponse()
    @ApiOperation({ summary: "Password Reset" })
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars
    async resetPassword(@Body() resetPasswordRequestDto: ResetPasswordRequest): Promise<void> {
        const userId = await this.recoverPasswordService.verifyResetToken(resetPasswordRequestDto.token);
        await this.authService.resetPassword(userId, resetPasswordRequestDto.password);
    }
}
