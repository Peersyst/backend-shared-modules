import { applyDecorators, UseGuards, ForbiddenException } from "@nestjs/common";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { KycUserGuard } from "./kyc.user.guard";

export function UserHasKyc(): MethodDecorator & ClassDecorator {
    return applyDecorators(
        UseGuards(KycUserGuard),
        ApiException(() => ForbiddenException),
    );
}
