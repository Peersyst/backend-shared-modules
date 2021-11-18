import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const role = this.reflector.get<string>("role", context.getHandler());
        if (!role) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        const hasRequiredRole = () => user?.type === role;

        return user && hasRequiredRole();
    }
}
