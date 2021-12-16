import { HttpException } from "@nestjs/common";
import { StorageErrorBody, StorageErrorCode } from "./error-codes";

export class StorageBusinessException extends HttpException {
    constructor(code: StorageErrorCode) {
        super(StorageErrorBody[code], StorageErrorBody[code].statusCode);
    }
}
