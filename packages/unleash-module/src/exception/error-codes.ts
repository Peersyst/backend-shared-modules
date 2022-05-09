import { HttpStatus } from "@nestjs/common";

export enum UnleashErrorCode {
    METHOD_NOT_AVAILABLE = "METHOD_NOT_AVAILABLE",
}

export const UnleashErrorBody: { [code in UnleashErrorCode]: { statusCode: HttpStatus; message: string } } = {
    [UnleashErrorCode.METHOD_NOT_AVAILABLE]: {
        statusCode: HttpStatus.CONFLICT,
        message: UnleashErrorCode.METHOD_NOT_AVAILABLE,
    },
};
