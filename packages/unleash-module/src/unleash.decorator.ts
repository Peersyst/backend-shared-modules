import { UseGuards, applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { UnleashBusinessException } from './exception/business.exception';
import { UnleashErrorCode } from './exception/error-codes';
import { UnleashGuard } from './unleash.guard';
import { UnleashInterceptor } from './unleash.interceptor';

export function UnleashToggle(name: string): MethodDecorator & ClassDecorator {
    return applyDecorators(
        SetMetadata("name", name),
        UseGuards(UnleashGuard),
        UseInterceptors(UnleashInterceptor),
        ApiException(() => new UnleashBusinessException(UnleashErrorCode.METHOD_NOT_AVAILABLE)),
    );
}
