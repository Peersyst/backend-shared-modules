<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

# Description

[Nest](https://github.com/nestjs/nest) framework TypeScript base auth module.

# Installation

```bash
$ npm install --save @peersyst/auth-module
```

# How to use it
## Base auth module (no 3rd party logins or 2fa)

- Import and register AuthModule in AppModule
```typescript
import { AuthModule } from "@peersyst/auth-module";

@Module({
    imports: [
        ConfigModule.forRoot(...),
        TypeOrmModule.forRootAsync(...),
        UserModule,
        AuthModule.register(UserModule, ConfigModule, ConfigService, {}),
    ],
})
export class AppModule {}
```

- UserModule should export a provider named UserService
```typescript
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    providers: [MyUserService, { provide: "UserService", useClass: MyUserService }],
    controllers: [UserController],
    exports: [MyUserService, { provide: "UserService", useClass: MyUserService }, TypeOrmModule],
})
export class UserModule {}
```

- Add configService configuration variables
```typescript
export default (): any => ({
    server: {
        secretKey: process.env.APP_JWT_KEY, ...
    },
});
```

- Add AuthErrorCode and AuthErrorBody to app ErrorCodes
```typescript
import { HttpStatus } from "@nestjs/common";
import { AuthErrorCode, AuthErrorBody } from "@peersyst/auth-module";

// Define app error codes
enum AppErrorCode {}

export const ErrorCode = { ...AppErrorCode, ...AuthErrorCode };
export type ErrorCodeType = AppErrorCode | AuthErrorCode;

export const ErrorBody: { [code in ErrorCodeType]: { statusCode: HttpStatus; message: string } } = {
    // Define app error code bodies
    ...AuthErrorBody,
};
```

- Implement AuthUserI for User entity
```typescript
import { AuthUserI, UserType } from "@peersyst/auth-module";

@Entity("user")
export class User implements AuthUserI {...}
```

- Implement AuthUserServiceI for UserService
```typescript
import { AuthUserServiceI } from "@peersyst/auth-module";

@Injectable()
export class UserService implements AuthUserServiceI {...}
```

- Use authenticated in controllers
```typescript
import { Authenticated } from "@peersyst/auth-module";

@ApiTags("user")
@Controller("users")
@ApiErrorDecorators()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Authenticated(UserType.ADMIN)
    @Post("create")
    @ApiOperation({ summary: "Create user" })
    async create(@Body() createUserRequestDto: CreateUserRequest): Promise<UserDto> {
        return this.userService.createUser(createUserRequestDto);
    }

    @Authenticated()
    @Get("info")
    @ApiOperation({ summary: "Show user info" })
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async info(@Request() req): Promise<UserDto> {
        return this.userService.findById(req.user.id);
    }
}
```


## Add Google login

- Set googleAuth to true in register module
```typescript
AuthModule.register(UserModule, ConfigModule, ConfigService, {
    googleAuth: true,
}),
```

- Add configService configuration variables
```typescript
export default (): any => ({
    server: {
        secretKey: process.env.APP_JWT_KEY,
        frontUrl: process.env.FRONT_URL,
        baseUrl: process.env.BASE_URL,
    },
    googleAuth: {
        clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    },
});
```

- Implement AuthGoogleUserI for User entity
```typescript
import { AuthUserI, AuthGoogleUserI, UserType } from "@peersyst/auth-module";

@Entity("user")
export class User implements AuthUserI, AuthGoogleUserI {...}
```

- Implement ThirdPartyUserServiceI for UserService
```typescript
import { AuthUserServiceI, ThirdPartyUserServiceI } from "@peersyst/auth-module";

@Injectable()
export class UserService implements AuthUserServiceI, ThirdPartyUserServiceI {...}
```

## Add Twitter login

- Set twitterAuth to true in register module
```typescript
AuthModule.register(UserModule, ConfigModule, ConfigService, {
    twitterAuth: true,
}),
```

- Add configService configuration variables
```typescript
export default (): any => ({
    server: {
        secretKey: process.env.APP_JWT_KEY,
        frontUrl: process.env.FRONT_URL,
        baseUrl: process.env.BASE_URL,
    },
    twitterAuth: {
        apiKey: process.env.TWITTER_API_KEY,
        apiKeySecret: process.env.TWITTER_API_KEY_SECRET,
    },
});
```

- Implement AuthTwitterUserI for User entity
```typescript
import { AuthUserI, AuthTwitterUserI, UserType } from "@peersyst/auth-module";

@Entity("user")
export class User implements AuthUserI, AuthTwitterUserI {...}
```

- Implement ThirdPartyUserServiceI for UserService
```typescript
import { AuthUserServiceI, ThirdPartyUserServiceI } from "@peersyst/auth-module";

@Injectable()
export class UserService implements AuthUserServiceI, ThirdPartyUserServiceI {...}
```

## Add Validate email

- Set validateEmail to true in register module
```typescript
AuthModule.register(UserModule, ConfigModule, ConfigService, {
    validateEmail: true,
}),
```

- Implement ValidateEmailUserServiceI for UserService
```typescript
import { AuthUserServiceI, ValidateEmailUserServiceI } from "@peersyst/auth-module";

@Injectable()
export class UserService implements AuthUserServiceI, ValidateEmailUserServiceI {...}
```

- When you either create or register a user an email verification token should be created and sent:
```typescript
import { AuthUserServiceI, ValidateEmailUserServiceI, TokenService } from "@peersyst/auth-module";

@Injectable()
export class UserService implements AuthUserServiceI, ValidateEmailUserServiceI {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @Inject(NotificationService) private readonly notificationService: NotificationService,
        @Inject(ValidateEmailService) private readonly validateEmailService: ValidateEmailService,
    ) {}
    
    async registerUser(registerUserRequest: RegisterUserRequest): Promise<PrivateUserDto> {
        const entity = await this.userRepository.save(registerUserRequest);
        const user = PrivateUserDto.fromEntity(entity);
        const token = await this.validateEmailService.createEmailVerificationToken(user.id);
        await this.notificationService.sendEmailVerificationMessage(createUserRequest.email, token);
    }
}
```

- Create entity in your entities folder with name VerifyEmailToken
```typescript
export { VerifyEmailToken } from "@peersyst/auth-module";
```

## Add Recover Password

- Set recoverPassword to true in register module and indicate NotificationModule.
```typescript
AuthModule.register(UserModule, ConfigModule, ConfigService, {
    recoverPassword: true,
    NotificationModule,
}),
```

NotificationModule should export a provider named NotificationService (v8 onwards):
```typescript
@Module({
    providers: [NotificationService, { provide: "NotificationService", useClass: NotificationService }],
    exports: [NotificationService, { provide: "NotificationService", useClass: NotificationService }],
})
export class NotificationModule {}
```

- Implement RecoverNotificationServiceI for NotificationService
```typescript
import { RecoverNotificationServiceI } from "@peersyst/auth-module";

@Injectable()
export class NotificationService implements RecoverNotificationServiceI {...}
```

- Implement RecoverPasswordUserServiceI for UserService
```typescript
import { AuthUserServiceI, RecoverPasswordUserServiceI } from "@peersyst/auth-module";

@Injectable()
export class UserService implements AuthUserServiceI, RecoverPasswordUserServiceI {...}
```

- Create entity in your entities folder with name ResetToken
```typescript
export { ResetToken } from "@peersyst/auth-module";
```

## Add 2 Factor Authenticated (work in progress)

- Set twoFA to true in register module
```typescript
AuthModule.register(UserModule, ConfigModule, ConfigService, {
    twoFA: true,
}),
```

- Implement Auth2FAUserI for User entity
```typescript
import { AuthUserI, Auth2FAUserI, UserType } from "@peersyst/auth-module";

@Entity("user")
export class User implements AuthUserI, Auth2FAUserI {...}
```

# License

Nest is [MIT licensed](LICENSE).
