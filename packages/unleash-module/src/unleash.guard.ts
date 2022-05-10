import { CanActivate, Injectable, Inject, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UnleashBusinessException } from "./exception/business.exception";
import { UnleashErrorCode } from "./exception/error-codes";
import { UnleashService } from "./unleash.service";

@Injectable()
export class UnleashGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, @Inject(UnleashService) private unleashService: UnleashService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const name = this.reflector.get<string>("name", context.getHandler());
        if (name && this.unleashService.isEnabled(name)) {
            return true;
        }

        throw new UnleashBusinessException(UnleashErrorCode.METHOD_NOT_AVAILABLE);
    }
}