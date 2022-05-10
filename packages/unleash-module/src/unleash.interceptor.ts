import { NestInterceptor, Injectable, Inject, ExecutionContext, HttpStatus, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { UnleashBusinessException } from "./exception/business.exception";
import { UnleashErrorCode } from "./exception/error-codes";
import { Response } from "express";

@Injectable()
export class UnleashInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        if (req.toggled === false) {
            const ctx = context.switchToHttp();
            const response = ctx.getResponse<Response>();
            response.status(HttpStatus.METHOD_NOT_ALLOWED).json({
                statusCode: HttpStatus.METHOD_NOT_ALLOWED,
                message: "METHOD_NOT_ALLOWED",
            });

            return null;
        }
        
        return next.handle();
    }
}