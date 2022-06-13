import { HttpException } from "@nestjs/common";
import { WalletErrorBody, WalletErrorCode } from "./error-codes";

export class BusinessException extends HttpException {
    constructor(code: WalletErrorCode) {
        super(WalletErrorBody[code], WalletErrorBody[code].statusCode);
    }
}
