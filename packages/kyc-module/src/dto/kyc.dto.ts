import { ApiProperty } from "@nestjs/swagger";

export enum KycStatus {
    INIT = "init",
    PENDING = "pending",
    QUEUED = "queued",
    COMPLETED = "completed",
    ON_HOLD = "onHold"
}

export enum KycAnswer {
    GREEN = "GREEN",
    RED = "RED"
}

export enum KycRejectType {
    RETRY = "RETRY",
    FINAL = "FINAL"
}

export interface SimplifiedKycI {
    userId: number;
    status: KycStatus;
    reviewAnswer: KycAnswer;
    moderationComment?: string;
    reviewRejectType?: KycRejectType;
    passed: boolean;
    updatedAt: Date;
}

export class SimplifiedKyc implements SimplifiedKycI {
    @ApiProperty()
    userId: number;

    @ApiProperty()
    status: KycStatus;

    @ApiProperty()
    reviewAnswer: KycAnswer;

    @ApiProperty()
    moderationComment?: string;

    @ApiProperty()
    reviewRejectType?: KycRejectType;

    @ApiProperty()
    passed: boolean;

    @ApiProperty()
    updatedAt: Date;
}

export interface KycI extends SimplifiedKycI {
    id: number;
    applicantId: string;
    clientComment?: string;
    rejectLabels?: string[];
}

export class Kyc extends SimplifiedKyc implements KycI {
    @ApiProperty()
    id: number;

    @ApiProperty()
    applicantId: string;

    @ApiProperty()
    clientComment?: string;

    @ApiProperty()
    rejectLabels?: string[];
}
