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

[Nest](https://github.com/nestjs/nest) framework TypeScript base kyc module using [sumsub](https://sumsub.com/).

# Installation

```bash
$ npm install --save @peersyst/kyc-module
```

# How to use it
## Base kyc module

- Import and register KycModule in AppModule and apply Signature middleware for SumsubController
```typescript
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { KycModule, SignatureMiddleware, SumsubController, OrmType } from "@peersyst/kyc-module";

@Module({
    imports: [
        ConfigModule.forRoot(...),
        TypeOrmModule.forRootAsync(...),
        UserModule,
        KycModule.register(UserModule, ConfigModule, {
          ormType: OrmType.TYPEORM,
          addTestEndpoints: false,
        }),
    ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignatureMiddleware).forRoutes(SumsubController);
  }
}
```

- Implement KycUserServiceI for your UserService
```typescript
import { KycUserServiceI } from "@peersyst/kyc-module";

@Injectable()
export class MyUserService implements KycUserServiceI {...}
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

- Enable rawBody on main.ts
```typescript
...
import * as bodyParser from "body-parser";
import { ServerResponse } from "http";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bodyParser: false });

    const rawBodyBuffer = (req: any, res: ServerResponse, buffer: Buffer, encoding: BufferEncoding) => {
        if (buffer && buffer.length) {
            req.rawBody = buffer.toString(encoding || "utf8");
        }
    };

    app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
    app.use(bodyParser.json({ verify: rawBodyBuffer }));
    ...
}
```

- Add configService configuration variables
```typescript
export default (): any => ({
    sumsub: {
        secretKey: process.env.SUMSUB_SECRET_KEY,
        baseUrl: process.env.SUMSUB_BASE_URL,
        appToken: process.env.APP_TOKEN,
    },
});
```

- Add KycErrorCode and KycErrorBody to app ErrorCodes
```typescript
import { HttpStatus } from "@nestjs/common";
import { KycErrorCode, KycErrorBody } from "@peersyst/kyc-module";

// Define app error codes
enum AppErrorCode {}

export const ErrorCode = { ...AppErrorCode, ...KycErrorCode };
export type ErrorCodeType = AppErrorCode | KycErrorCode;

export const ErrorBody: { [code in ErrorCodeType]: { statusCode: HttpStatus; message: string } } = {
    // Define app error code bodies
    ...KycErrorBody,
};
```

- If ormType is sequelize: create model in your models folder with name KycModel
```typescript
export { KycModel } from "@peersyst/kyc-module";
```

- If ormType is typeorm: create entity in your entities folder with name KycEntity
```typescript
export { KycEntity } from "@peersyst/kyc-module";
```

## Add Notifications

- Set notifications to true in register module and add NotificationModule
```typescript
KycModule.register(UserModule, ConfigModule, {
    ...
    notifications: true,
    NotificationModule: MyNotificationModule,
}),
```

NotificationModule should export a provider named NotificationService (v8 onwards):
```typescript
@Module({
    providers: [MyNotificationService, { provide: "NotificationService", useClass: MyNotificationService }],
    exports: [MyNotificationService, { provide: "NotificationService", useClass: MyNotificationService }],
})
export class NotificationModule {}
```

- Implement KycNotificationInterface for your NotificationService
```typescript
import { KycNotificationInterface } from "@peersyst/kyc-module";

@Injectable()
export class MyNotificationService implements KycNotificationInterface {...}
```

# License

Nest is [MIT licensed](LICENSE).
