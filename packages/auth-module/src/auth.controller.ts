import { Body, Controller, Post, Request, UnauthorizedException, UseGuards, Get, Response, Inject } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { AuthCredentialsDtoI } from "./dto/auth-credentials.dto";
import { ApiErrorDecorators } from "./exception/error-response.decorator";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { BusinessException } from "./exception/business.exception";
import { AuthErrorCode } from "./exception/error-codes";
import { ThirdPartyUserDtoI } from "./dto/third-party-user.dto";
import { TwitterAuthGuard } from "./guards/twitter-auth.guard";
import { ConfigService } from "@nestjs/config";
import { ValidateEmailRequest, ResetPasswordRequest, LoginRequest } from "./requests";

@ApiTags("authenticate")
@Controller("auth")
@ApiErrorDecorators()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @Inject(ConfigService) private configService: ConfigService
    ) {}

    @ApiOperation({ summary: "Authenticate user with email" })
    @UseGuards(LocalAuthGuard)
    @Post("login")
    @ApiException(() => UnauthorizedException)
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async login(@Body() loginRequestDto: LoginRequest, @Request() req): Promise<AuthCredentialsDtoI> {
        const accessToken = await this.authService.login(req.user);
        return accessToken;
    }
}

@ApiTags("authenticate")
@Controller("auth/google")
@ApiErrorDecorators()
export class AuthGoogleController {
    constructor(
        private readonly authService: AuthService,
        @Inject(ConfigService) private configService: ConfigService
    ) {}

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
    constructor(
        private readonly authService: AuthService,
        @Inject(ConfigService) private configService: ConfigService
    ) {}

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
    constructor(
        private readonly authService: AuthService,
        @Inject(ConfigService) private configService: ConfigService
    ) {}

    @Post("verify-email")
    @ApiOperation({ summary: "Verify user email" })
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async verifyEmail(@Body() validateEmailRequest: ValidateEmailRequest): Promise<AuthCredentialsDtoI> {
        const tokenData = await this.userService.verifyEmail(validateEmailRequest.token);
        const user = await this.userService.findById(tokenData.userId);
        const accessToken = await this.authService.login(user);
        return accessToken;
    }
}

@ApiTags("authenticate")
@Controller("auth")
@ApiErrorDecorators()
export class AuthRecoverController {
    constructor(
        private readonly authService: AuthService,
        @Inject(ConfigService) private configService: ConfigService
    ) {}

    @Post("recover-password")
    @ApiOperation({ summary: "Request Password Reset" })
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars
    async requestResetPassword(@Query("email") email: string): Promise<void> {
        await this.userService.requestResetPassword(email);
        return;
    }

    @Post("reset-password")
    @ApiOperation({ summary: "Password Reset" })
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars
    async resetPassword(@Query("token") token: string, @Body() resetPasswordRequestDto: ResetPasswordRequest): Promise<void> {
        await this.userService.resetPassword(token, resetPasswordRequestDto.password);
        return;
    }
}
