import { HttpStatus } from "@nestjs/common";

export enum AuthErrorCode {
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    EMAIL_ALREADY_TAKEN = "EMAIL_ALREADY_TAKEN",
    TOKEN_NOT_FOUND = "TOKEN_NOT_FOUND",
    TOKEN_ALREADY_VERIFIED = "TOKEN_ALREADY_VERIFIED",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    BLOCKED_USER = "BLOCKED_USER",
    EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
}

export const AuthErrorBody: { [code in AuthErrorCode]: { statusCode: HttpStatus; message: string } } = {
    [AuthErrorCode.INVALID_CREDENTIALS]: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: AuthErrorCode.INVALID_CREDENTIALS,
    },
    [AuthErrorCode.USER_NOT_FOUND]: {
        statusCode: HttpStatus.NOT_FOUND,
        message: AuthErrorCode.USER_NOT_FOUND,
    },
    [AuthErrorCode.EMAIL_ALREADY_TAKEN]: {
        statusCode: HttpStatus.CONFLICT,
        message: AuthErrorCode.EMAIL_ALREADY_TAKEN,
    },
    [AuthErrorCode.TOKEN_NOT_FOUND]: {
        statusCode: HttpStatus.NOT_FOUND,
        message: AuthErrorCode.TOKEN_NOT_FOUND,
    },
    [AuthErrorCode.TOKEN_ALREADY_VERIFIED]: {
        statusCode: HttpStatus.CONFLICT,
        message: AuthErrorCode.TOKEN_ALREADY_VERIFIED,
    },
    [AuthErrorCode.TOKEN_EXPIRED]: {
        statusCode: HttpStatus.CONFLICT,
        message: AuthErrorCode.TOKEN_EXPIRED,
    },
    [AuthErrorCode.BLOCKED_USER]: {
        statusCode: HttpStatus.CONFLICT,
        message: AuthErrorCode.BLOCKED_USER,
    },
    [AuthErrorCode.EMAIL_NOT_VERIFIED]: {
        statusCode: HttpStatus.CONFLICT,
        message: AuthErrorCode.EMAIL_NOT_VERIFIED,
    },
};
