import { HttpStatus } from "@nestjs/common";

export enum XummErrorCode {
    USER_NOT_SIGNED_IN = "USER_NOT_SIGNED_IN",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
}

export const XummErrorBody: { [code in XummErrorCode]: { statusCode: HttpStatus; message: string } } = {
    [XummErrorCode.USER_NOT_SIGNED_IN]: {
        statusCode: HttpStatus.PRECONDITION_FAILED,
        message: XummErrorCode.USER_NOT_SIGNED_IN,
    },
    [XummErrorCode.TOKEN_EXPIRED]: {
        statusCode: HttpStatus.PRECONDITION_FAILED,
        message: XummErrorCode.USER_NOT_SIGNED_IN,
    },
};
