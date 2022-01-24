# Description

[Nest](https://github.com/nestjs/nest) framework TypeScript Module for interacting with XUMM wallet.


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
        }),
    ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignatureMiddleware).forRoutes(SumsubController);
  }
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

- Set notifications to true in register module and add NotificationService
```typescript
KycModule.register(UserModule, ConfigModule, {
    ...
    notifications: true,
    NotificationService: MyNotificationService,
}),
```

- Implement KycNotificationInterface for your NotificationService
```typescript
import { KycNotificationInterface } from "@peersyst/kyc-module";

@Injectable()
export class MyNotificationService implements KycNotificationInterface {...}
```

# License

Nest is [MIT licensed](LICENSE).
