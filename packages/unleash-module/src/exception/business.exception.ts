import { UnleashErrorBody, UnleashErrorCode } from "./error-codes";
import { HttpException } from "@nestjs/common";

export class UnleashBusinessException extends HttpException {
    constructor(code: UnleashErrorCode) {
        super(UnleashErrorBody[code], UnleashErrorBody[code].statusCode);
    }
}
