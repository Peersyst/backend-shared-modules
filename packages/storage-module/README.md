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

[Nest](https://github.com/nestjs/nest) framework TypeScript base storage module.

# Installation

```bash
$ npm install --save @peersyst/storage-module
```

# How to use it
## Base storage module

- Import and register StorageModule in AppModule
```typescript
import { Module } from "@nestjs/common";
import { StorageModule, StorageType } from "@peersyst/storage-module";

@Module({
    imports: [
        ConfigModule.forRoot(...),
        StorageModule.register(ConfigModule, {
          storageType: StorageType.LOCAL,
        }),
        ...
    ],
    ...
})
export class AppModule {}
```

- Add StorageErrorCode and StorageErrorBody to app ErrorCodes
```typescript
import { HttpStatus } from "@nestjs/common";
import { StorageErrorCode, StorageErrorBody } from "@peersyst/storage-module";

// Define app error codes
enum AppErrorCode {}

export const ErrorCode = { ...AppErrorCode, ...StorageErrorCode };
export type ErrorCodeType = AppErrorCode | StorageErrorCode;

export const ErrorBody: { [code in ErrorCodeType]: { statusCode: HttpStatus; message: string } } = {
    // Define app error code bodies
    ...StorageErrorBody,
};
```

- Import StorageModule in the modules you want to use it
```typescript
import { Module } from "@nestjs/common";
import { StorageModule, StorageType } from "@peersyst/storage-module";

@Module({
    imports: [
        StorageModule.register(ConfigModule, {
          storageType: StorageType.LOCAL,
        }),
        ...
    ],
    ...
})
export class ResourceModule {}
```

- Inject StorageService in the in the classes you want to use it
```typescript
import { InjectRepository, Inject } from "@nestjs/common";
import { StorageServiceInterface } from "@peersyst/storage-module";

export class ResourceService {
  constructor(
    @InjectRepository(Resource) private readonly resourceRepository: Repository<Resource>,
    @Inject("StorageService") private readonly storageService: StorageServiceInterface,
  )
}
```

## S3 Storage Type

- Add configService configuration variables
```typescript
export default (): any => ({
    aws: {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        bucketName: process.env.AWS_BUCKET_NAME,
    },
});
```

## Local Storage Type

- Add configService configuration variables
```typescript
export default (): any => ({
    local: {
        rootPath: process.env.LOCAL_ROOT_PATH,
    },
});
```

# License

Nest is [MIT licensed](LICENSE).
