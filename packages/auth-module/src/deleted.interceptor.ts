import { NestInterceptor, Injectable, ExecutionContext, CallHandler, HttpStatus } from "@nestjs/common";
import { Observable } from "rxjs";
import { Response } from "express";

@Injectable()
export class DeletedInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();

        if (req.deleted === true) {
            const response = context.switchToHttp().getResponse<Response>();
            response.status(HttpStatus.UNAUTHORIZED).json({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: "Unauthorized",
            });

            return null;
        }

        return next.handle();
    }
}