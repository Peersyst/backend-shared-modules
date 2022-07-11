import { HttpException } from "@nestjs/common";
import { PaymentErrorBody, PaymentErrorCode } from "./error-codes";

export class PaymentBusinessException extends HttpException {
    constructor(code: PaymentErrorCode) {
        super(PaymentErrorBody[code], PaymentErrorBody[code].statusCode);
    }
}
