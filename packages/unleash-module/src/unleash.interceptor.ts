import { NestInterceptor, Injectable, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { Response } from "express";
import { UnleashErrorCode, UnleashErrorBody } from "./exception/error-codes";

@Injectable()
export class UnleashInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        if (req.toggled === false) {
            const ctx = context.switchToHttp();
            const response = ctx.getResponse<Response>();
            response.status(UnleashErrorBody[UnleashErrorCode.METHOD_NOT_ALLOWED].statusCode).json({
                statusCode: UnleashErrorBody[UnleashErrorCode.METHOD_NOT_ALLOWED].statusCode,
                message: UnleashErrorBody[UnleashErrorCode.METHOD_NOT_ALLOWED].message,
            });

            return null;
        }
        
        return next.handle();
    }
}