import { UseGuards, applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { UnleashBusinessException } from './exception/business.exception';
import { UnleashErrorCode } from './exception/error-codes';
import { UnleashGuard } from './unleash.guard';

export function UnleashToggle(name: string): MethodDecorator & ClassDecorator {
    return applyDecorators(
        SetMetadata("name", name),
        UseGuards(UnleashGuard),
        ApiException(() => new UnleashBusinessException(UnleashErrorCode.METHOD_NOT_AVAILABLE)),
    );
}
