import { Body, Controller, Post, Request, UnauthorizedException, UseGuards, Get, Response, Inject, Logger } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { LoginRequest } from "./login.request";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ApiErrorDecorators } from "./exception/error-response.decorator";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { BusinessException } from "./exception/business.exception";
import { AuthErrorCode } from "./exception/error-codes";
import { ThirdPartyUserDto } from "./dto/third-party-user.dto";
import { TwitterAuthGuard } from "./guards/twitter-auth.guard";
import { ConfigService } from "@nestjs/config";

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
    async login(@Body() loginRequestDto: LoginRequest, @Request() req): Promise<AuthCredentialsDto> {
        const accessToken = await this.authService.login(req.user);
        return accessToken;
    }

    @ApiOperation({ summary: "Authenticate user with Google" })
    @UseGuards(GoogleAuthGuard)
    @Get("google")
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async googleAuth(): Promise<void> {}

    @ApiOperation({ summary: "Google auth callback" })
    @UseGuards(GoogleAuthGuard)
    @Get("google/callback")
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async googleAuthRedirect(@Request() req, @Response() res) {
        if (!req.user) {
            throw new BusinessException(AuthErrorCode.USER_NOT_FOUND);
        }
        const user: ThirdPartyUserDto = req.user;
        const { access_token } = await this.authService.googleLogin(user);
        res.cookie("access_token", access_token, { expires: new Date(Date.now() + 60000) });
        res.redirect(this.configService.get("server.frontUrl"));
    }

    @ApiOperation({ summary: "Authenticate user with Twitter" })
    @UseGuards(TwitterAuthGuard)
    @Get("twitter")
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async twitterAuth(): Promise<void> {}

    @ApiOperation({ summary: "Twitter auth callback" })
    @UseGuards(TwitterAuthGuard)
    @Get("twitter/callback")
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async twitterAuthRedirect(@Request() req, @Response() res) {
        if (!req.user) {
            throw new BusinessException(AuthErrorCode.USER_NOT_FOUND);
        }
        const user: ThirdPartyUserDto = req.user;
        const { access_token } = await this.authService.twitterLogin(user);
        res.cookie("access_token", access_token, { expires: new Date(Date.now() + 60000) });
        res.redirect(this.configService.get("server.frontUrl"));
    }
}
