import { HttpException } from "@nestjs/common";
import { KycErrorBody, KycErrorCode } from "./error-codes";

export class BusinessException extends HttpException {
    constructor(code: KycErrorCode) {
        super(KycErrorBody[code], KycErrorBody[code].statusCode);
    }
}
