import { HttpStatus } from "@nestjs/common";

export enum AuthErrorCode {
    USER_NOT_FOUND = "user_not_found",
    EMAIL_ALREADY_TAKEN = "email_already_taken",
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
};
