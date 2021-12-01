import { ApiProperty } from "@nestjs/swagger";
import { KycAnswer, KycStatus } from "../dto/kyc.dto";
import { SumSubWebhookRequest } from "./sumsub-webhook.request";

const applicantPersonalInfoChanged = "applicantPersonalInfoChanged";
export type applicantPersonalInfoChangedType = "applicantPersonalInfoChanged";
export class reviewAnswerProp {
    @ApiProperty({
        enum: KycAnswer,
        required: true,
    })
    reviewAnswer: KycAnswer;
}

export class ApplicantPersonalInfoChangedRequest extends SumSubWebhookRequest {
    @ApiProperty({
        enum: [applicantPersonalInfoChanged],
        required: true,
    })
    type: applicantPersonalInfoChangedType;

    @ApiProperty({
        enum: KycStatus,
        required: true,
    })
    reviewStatus: KycStatus;

    @ApiProperty({
        type: () => reviewAnswerProp,
        required: true,
    })
    reviewResult: reviewAnswerProp;
}
