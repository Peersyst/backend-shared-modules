import { HttpStatus } from "@nestjs/common";

export enum KycErrorCode {
    KYC_NOT_FOUND = "KYC_NOT_FOUND",
    SUMSUB_REQUEST_ERROR = "SUMSUB_REQUEST_ERROR",
    USER_NOT_FOUND = "USER_NOT_FOUND",
}

export const KycErrorBody: { [code in KycErrorCode]: { statusCode: HttpStatus; message: string } } = {
    [KycErrorCode.KYC_NOT_FOUND]: {
        statusCode: HttpStatus.NOT_FOUND,
        message: KycErrorCode.KYC_NOT_FOUND,
    },
    [KycErrorCode.SUMSUB_REQUEST_ERROR]: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: KycErrorCode.SUMSUB_REQUEST_ERROR,
    },
    [KycErrorCode.USER_NOT_FOUND]: {
        statusCode: HttpStatus.NOT_FOUND,
        message: KycErrorCode.USER_NOT_FOUND,
    },
};
