import { HttpException } from "@nestjs/common";
import { UnleashErrorBody, UnleashErrorCode } from "./error-codes";

export class UnleashBusinessException extends HttpException {
    constructor(code: UnleashErrorCode) {
        super(UnleashErrorBody[code], UnleashErrorBody[code].statusCode);
    }
}
