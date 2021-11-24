import { applyDecorators, ForbiddenException, SetMetadata, UnauthorizedException, UseGuards, Logger } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { RolesGuard } from "./guards/roles.guard";
import { WithUserType } from "./entities/AuthUser";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

export function Authenticated<T>(role?: WithUserType<T> | string | WithUserType<T>[] | string[]): MethodDecorator {
    return applyDecorators(
        SetMetadata("role", role),
        UseGuards(JwtAuthGuard),
        ApiBearerAuth(),
        UseGuards(RolesGuard),
        ApiException(() => UnauthorizedException),
        ApiException(() => ForbiddenException),
    );
}
