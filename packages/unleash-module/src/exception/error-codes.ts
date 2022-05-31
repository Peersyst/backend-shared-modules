import { HttpStatus } from "@nestjs/common";

export enum UnleashErrorCode {
    METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED",
}

export const UnleashErrorBody: { [code in UnleashErrorCode]: { statusCode: HttpStatus; message: string } } = {
    [UnleashErrorCode.METHOD_NOT_ALLOWED]: {
        statusCode: HttpStatus.METHOD_NOT_ALLOWED,
        message: UnleashErrorCode.METHOD_NOT_ALLOWED,
    },
};
