import { ApiProperty } from "@nestjs/swagger";
import { KycStatus } from "../dto/kyc.dto";
import { SumSubWebhookRequest } from "./sumsub-webhook.request";

const applicantOnHold = "applicantOnHold";
export type applicantOnHoldType = "applicantOnHold";

export class ApplicantOnHoldRequest extends SumSubWebhookRequest {
    @ApiProperty({
        enum: [applicantOnHold],
        required: true,
    })
    type: applicantOnHoldType;

    @ApiProperty({
        enum: [KycStatus.ON_HOLD],
        required: true,
    })
    reviewStatus: KycStatus.ON_HOLD;
}
