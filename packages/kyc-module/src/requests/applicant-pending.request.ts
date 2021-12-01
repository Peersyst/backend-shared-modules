import { ApiProperty } from "@nestjs/swagger";
import { KycStatus } from "../dto/kyc.dto";
import { SumSubWebhookRequest } from "./sumsub-webhook.request";

const applicantPending = "applicantPending";
export type applicantPendingType = "applicantPending";

export class ApplicantPendingRequest extends SumSubWebhookRequest {
    @ApiProperty({
        enum: [applicantPending],
        required: true,
    })
    type: applicantPendingType;

    @ApiProperty({
        enum: [KycStatus.PENDING],
        required: true,
    })
    reviewStatus: KycStatus.PENDING;
}
