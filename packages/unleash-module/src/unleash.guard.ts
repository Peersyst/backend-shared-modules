import { CanActivate, Injectable, Inject, ExecutionContext, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UnleashService } from "./unleash.service";

@Injectable()
export class UnleashGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, @Inject(UnleashService) private unleashService: UnleashService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const className = this.reflector.get<string>("name", context.getClass());
        const methodName = this.reflector.get<string>("name", context.getHandler());
        const classToggled = className && this.unleashService.isEnabled(className);
        const methodToggled = methodName && this.unleashService.isEnabled(methodName);

        if (methodName && className) {
            req.toggled = methodToggled && classToggled;
        } else if (methodName) {
            req.toggled = methodToggled;
        } else if (className) {
            req.toggled = classToggled;
        } else {
            req.toggled = false;
        }

        return true;
    }
}