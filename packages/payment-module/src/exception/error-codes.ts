import { HttpStatus } from "@nestjs/common";

export enum PaymentErrorCode {
    PAYMENT_TYPE_NOT_IMPLEMENTED = "PAYMENT_TYPE_NOT_IMPLEMENTED",
    PAYMENT_NOT_FOUND = "PAYMENT_NOT_FOUND",
    UNINITIATED_PAYMENT = "UNINITIATED_PAYMENT",
}

export const PaymentErrorBody: { [code in PaymentErrorCode]: { statusCode: HttpStatus; message: string } } = {
    [PaymentErrorCode.PAYMENT_TYPE_NOT_IMPLEMENTED]: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: PaymentErrorCode.PAYMENT_TYPE_NOT_IMPLEMENTED,
    },
    [PaymentErrorCode.PAYMENT_NOT_FOUND]: {
        statusCode: HttpStatus.NOT_FOUND,
        message: PaymentErrorCode.PAYMENT_NOT_FOUND,
    },
    [PaymentErrorCode.UNINITIATED_PAYMENT]: {
        statusCode: HttpStatus.NOT_FOUND,
        message: PaymentErrorCode.UNINITIATED_PAYMENT,
    },
};
