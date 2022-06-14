import { HttpException } from "@nestjs/common";
import { TransactionErrorBody, TransactionErrorCode } from "./error-codes";

export class BusinessException extends HttpException {
    constructor(code: TransactionErrorCode) {
        super(TransactionErrorBody[code], TransactionErrorBody[code].statusCode);
    }
}
