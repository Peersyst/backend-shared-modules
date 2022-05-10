import { CanActivate, Injectable, Inject, ExecutionContext, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UnleashService } from "./unleash.service";

@Injectable()
export class UnleashGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, @Inject(UnleashService) private unleashService: UnleashService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const name = this.reflector.get<string>("name", context.getHandler());
        const req = context.switchToHttp().getRequest();
        req.toggled = name && this.unleashService.isEnabled(name);

        return true;
    }
}