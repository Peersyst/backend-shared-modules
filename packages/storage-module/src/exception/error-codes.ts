import { HttpStatus } from "@nestjs/common";

export enum StorageErrorCode {
    FILE_NOT_FOUND = "FILE_NOT_FOUND",
}

export const StorageErrorBody: { [code in StorageErrorCode]: { statusCode: HttpStatus; message: string } } = {
    [StorageErrorCode.FILE_NOT_FOUND]: {
        statusCode: HttpStatus.NOT_FOUND,
        message: StorageErrorCode.FILE_NOT_FOUND,
    },
};
