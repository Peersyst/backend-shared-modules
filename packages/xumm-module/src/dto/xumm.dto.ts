export interface XummI {
    userToken: string;
    address: string;
    payloadId?: string;
}

export enum XummStatus {
    NOT_SIGNED = "not-signed",
    SIGNED = "signed",
    PENDING = "pending",
    BAD_SIGNATURE = "bad-signature",
    CANCELLED = "cancelled",
    EXPIRED = "expired",
}