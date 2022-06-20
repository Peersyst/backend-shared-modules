import { HttpStatus } from "@nestjs/common";

export enum WalletErrorCode {
    USER_HAVE_WALLET = "USER_HAVE_WALLET",
    USER_DONT_HAVE_WALLET = "USER_DONT_HAVE_WALLET",
}

export const WalletErrorBody: { [code in WalletErrorCode]: { statusCode: HttpStatus; message: string } } = {
    [WalletErrorCode.USER_HAVE_WALLET]: {
        statusCode: HttpStatus.CONFLICT,
        message: WalletErrorCode.USER_HAVE_WALLET,
    },
    [WalletErrorCode.USER_DONT_HAVE_WALLET]: {
        statusCode: HttpStatus.CONFLICT,
        message: WalletErrorCode.USER_DONT_HAVE_WALLET,
    }
};
