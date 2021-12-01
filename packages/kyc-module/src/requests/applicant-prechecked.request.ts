import { ApiProperty } from "@nestjs/swagger";
import { KycStatus } from "../dto/kyc.dto";
import { SumSubWebhookRequest } from "./sumsub-webhook.request";

const applicantPrechecked = "applicantPrechecked";
export type applicantPrecheckedType = "applicantPrechecked";

export class ApplicantPrecheckedRequest extends SumSubWebhookRequest {
    @ApiProperty({
        enum: [applicantPrechecked],
        required: true,
    })
    type: applicantPrecheckedType;

    @ApiProperty({
        enum: [KycStatus.QUEUED],
        required: true,
    })
    reviewStatus: KycStatus.QUEUED;
}
