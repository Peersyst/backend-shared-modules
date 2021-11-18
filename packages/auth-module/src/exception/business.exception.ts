import { HttpException } from "@nestjs/common";
import { AuthErrorBody, AuthErrorCode } from "./error-codes";

export class BusinessException extends HttpException {
    constructor(code: AuthErrorCode) {
        super(AuthErrorBody[code], AuthErrorBody[code].statusCode);
    }
}
