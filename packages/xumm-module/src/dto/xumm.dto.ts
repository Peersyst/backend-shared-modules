export interface XummI {
    userToken: string;
    address: string;
    payloadId?: string;
}

export enum XummStatus {
    NOT_SIGNED = "not-signed",
    SIGNED = "signed",
    BAD_SIGNATURE = "bad-signature",
    EXPIRED = "expired",
}