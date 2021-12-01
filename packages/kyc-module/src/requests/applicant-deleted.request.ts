import { ApiProperty } from "@nestjs/swagger";
import { KycStatus } from "../dto/kyc.dto";
import { SumSubWebhookRequest } from "./sumsub-webhook.request";

const applicantDeleted = "applicantDeleted";
export type applicantDeletedType = "applicantDeleted";

export class ApplicantDeletedRequest extends SumSubWebhookRequest {
    @ApiProperty({
        enum: [applicantDeleted],
        required: true,
    })
    type: applicantDeletedType;

    @ApiProperty({
        enum: [KycStatus.INIT],
        required: true,
    })
    reviewStatus: KycStatus.INIT;
}
