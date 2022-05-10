import { NestInterceptor, Injectable, Inject, ExecutionContext, HttpStatus, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { UnleashBusinessException } from "./exception/business.exception";
import { UnleashErrorCode } from "./exception/error-codes";

@Injectable()
export class UnleashInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        if (req.toggled === false) {
            throw new UnleashBusinessException(UnleashErrorCode.METHOD_NOT_AVAILABLE);
        }
        
        return next.handle();
    }
}