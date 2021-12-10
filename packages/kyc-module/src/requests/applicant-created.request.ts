import { ApiProperty } from "@nestjs/swagger";
import { KycStatus } from "../dto/kyc.dto";
import { SumSubWebhookRequest } from "./sumsub-webhook.request";

const applicantCreated = "applicantCreated";
export type applicantCreatedType = "applicantCreated";

export class ApplicantCreatedRequest extends SumSubWebhookRequest {
    @ApiProperty({
        enum: [applicantCreated],
        required: true,
    })
    type: applicantCreatedType;

    @ApiProperty({
        enum: [KycStatus.INIT],
        required: true,
    })
    reviewStatus: KycStatus.INIT;
}
