import { CanActivate, ExecutionContext, Injectable, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        let role = this.reflector.get<string | string[]>("role", context.getHandler());
        if (!role) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            return false;
        }

        if (typeof role === "string") {
            role = [role];
        }

        const hasRole = role.some((r) => user.type === r);
        return hasRole;
    }
}
