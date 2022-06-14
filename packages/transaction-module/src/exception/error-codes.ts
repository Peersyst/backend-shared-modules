import { HttpStatus } from "@nestjs/common";

export enum TransactionErrorCode {
    CONDITION_TYPE_NOT_FOUND = "CONDITION_TYPE_NOT_FOUND",
    TRANSACTION_NOT_FOUND = "TRANSACTION_NOT_FOUND",
}

export const TransactionErrorBody: { [code in TransactionErrorCode]: { statusCode: HttpStatus; message: string } } = {
    [TransactionErrorCode.CONDITION_TYPE_NOT_FOUND]: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: TransactionErrorCode.CONDITION_TYPE_NOT_FOUND,
    },
    [TransactionErrorCode.TRANSACTION_NOT_FOUND]: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: TransactionErrorCode.TRANSACTION_NOT_FOUND,
    },
};
