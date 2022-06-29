import { applyDecorators, ForbiddenException, SetMetadata, UnauthorizedException, UseGuards, Logger, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { RolesGuard } from "./guards/roles.guard";
import { WithUserType } from "./entities/AuthUser";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { BlockDeletedGuard } from "./guards/block-deleted.guard";
import { DeletedInterceptor } from "./deleted.interceptor";

export function Authenticated<T>(role?: WithUserType<T> | string | WithUserType<T>[] | string[]): MethodDecorator {
    return applyDecorators(
        SetMetadata("role", role),
        UseGuards(JwtAuthGuard),
        ApiBearerAuth(),
        UseGuards(BlockDeletedGuard),
        UseInterceptors(DeletedInterceptor),
        UseGuards(RolesGuard),
        ApiException(() => UnauthorizedException),
        ApiException(() => ForbiddenException),
    );
}
