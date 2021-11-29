import { HttpStatus } from "@nestjs/common";

export enum AuthErrorCode {
    USER_NOT_FOUND = "user_not_found",
    EMAIL_ALREADY_TAKEN = "email_already_taken",
    TOKEN_NOT_FOUND = "token_not_found",
    TOKEN_ALREADY_VERIFIED = "token_already_verified",
    TOKEN_EXPIRED = "token_expired",
}

export const AuthErrorBody: { [code in AuthErrorCode]: { statusCode: HttpStatus; message: string } } = {
    [AuthErrorCode.USER_NOT_FOUND]: {
        statusCode: HttpStatus.NOT_FOUND,
        message: "User not found",
    },
    [AuthErrorCode.EMAIL_ALREADY_TAKEN]: {
        statusCode: HttpStatus.CONFLICT,
        message: "Email already taken",
    },
    [AuthErrorCode.TOKEN_NOT_FOUND]: {
        statusCode: HttpStatus.NOT_FOUND,
        message: "Token not found",
    },
    [AuthErrorCode.TOKEN_ALREADY_VERIFIED]: {
        statusCode: HttpStatus.CONFLICT,
        message: "Token already verified",
    },
    [AuthErrorCode.TOKEN_EXPIRED]: {
        statusCode: HttpStatus.CONFLICT,
        message: "Token expired",
    },
};
