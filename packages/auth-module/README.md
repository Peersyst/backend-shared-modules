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
$ npm install
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
        AuthModule.register(UserModule, ConfigModule, ConfigService, {
            googleAuth: false,
            twitterAuth: false,
            2fa: false,
        }),
    ],
})
export class AppModule {}
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
    twitterAuth: false,
    2fa: false,
}),
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
    googleAuth: false,
    twitterAuth: true,
    2fa: false,
}),
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

## Add 2 Factor Authenticated

- Set 2fa to true in register module
```typescript
AuthModule.register(UserModule, ConfigModule, ConfigService, {
    googleAuth: false,
    twitterAuth: true,
    2fa: false,
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
