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

[Nest](https://github.com/nestjs/nest) framework TypeScript base unleash module.

# Installation

```bash
$ npm install --save @peersyst/unleash-module
```

# How to use it

## Unleash module import config

- Import and register UnleashModule in AppModule
```typescript
import { Module } from "@nestjs/common";
import { UnleashModule } from "@peersyst/unleash-module";

@Module({
    imports: [
        ConfigModule.forRoot(...),
        UnleashModule.register(ConfigModule),
        ...
    ],
    ...
})
export class AppModule {}
```

- Add configService configuration variables
```typescript
export default (): any => ({
    unleash: {
        appName: process.env.UNLEASH_APP_NAME,
        url: process.env.UNLEASH_URL,
        environment: process.env.UNLEASH_ENVIRONMENT,
        apiToken: process.env.UNLEASH_API_TOKEN,
    },
});
```

- Add UnleashErrorCode and UnleashErrorBody to app ErrorCodes
```typescript
import { HttpStatus } from "@nestjs/common";
import { UnleashErrorCode, UnleashErrorBody } from "@peersyst/unleash-module";
// Define app error codes
enum AppErrorCode {}

export const ErrorCode = { ...AppErrorCode, ...UnleashErrorCode };
export type ErrorCodeType = AppErrorCode | UnleashErrorCode;

export const ErrorBody: { [code in ErrorCodeType]: { statusCode: HttpStatus; message: string } } = {
    // Define app error code bodies
    ...UnleashErrorBody,
};
```

## Decorate functions you want to toggle

- Inject UnleashService in the in the classes you want to use it
```typescript
import { Inject, Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UnleashToggle } from "@peersyst/unleash-module";
import { CatService } from "./cat.service.ts"
import { CatDto, PaginatedCatDto } from "./cat.dto.ts"

@ApiTags("cats")
@Controller("cat")
export class CatController {
  constructor(
    @Inject("CatService") private readonly catService: CatService,
  )

  @UnleashToggle("all-cats")
  @Get("")
  async getAllCats(): Promise<PaginatedCatDto> {
    return this.catService.getAllCats();
  }

  @UnleashToggle("get-cat")
  @Get(":id")
  async getCat(@Param("id") id: number): Promise<CatDto> {
    return this.catService.getCat(id);
  }
}
```


# License

Nest is [MIT licensed](LICENSE).