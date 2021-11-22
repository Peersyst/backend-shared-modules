import { applyDecorators, ForbiddenException, SetMetadata, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { RolesGuard } from "./guards/roles.guard";
import { UserType } from "./entities/AuthUser";
import { TwoFactorAuthGuard } from "./guards/two-factor-auth.guard";

export function Authenticated(role?: UserType | string): MethodDecorator {
    return applyDecorators(
        SetMetadata("role", role),
        UseGuards(TwoFactorAuthGuard),
        ApiBearerAuth(),
        UseGuards(RolesGuard),
        ApiException(() => UnauthorizedException),
        ApiException(() => ForbiddenException),
    );
}
