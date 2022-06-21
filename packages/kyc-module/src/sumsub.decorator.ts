import { applyDecorators, ForbiddenException, UseGuards } from "@nestjs/common";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { DigestGuard } from "./sumsub.digest.guard";

export function DigestedFromSumsub(): MethodDecorator & ClassDecorator {
    return applyDecorators(
        UseGuards(DigestGuard),
        ApiException(() => ForbiddenException),
    );
}
