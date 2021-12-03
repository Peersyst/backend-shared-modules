import { ApiProperty } from "@nestjs/swagger";
import { KycAnswer, KycRejectType, KycStatus } from "../dto/kyc.dto";
import { SumSubWebhookRequest } from "./sumsub-webhook.request";

const applicantReviewed = "applicantReviewed";
export type applicantReviewedType = "applicantReviewed";
export class ReviewResultProp {
    @ApiProperty({
        enum: KycAnswer,
        required: true,
    })
    reviewAnswer: KycAnswer;

    @ApiProperty({
        type: "string",
        required: false,
    })
    moderationComment?: string;

    @ApiProperty({
        type: "string",
        required: false,
    })
    clientComment?: string;

    @ApiProperty({
        type: [String],
        required: false,
    })
    rejectLabels?: string[];

    @ApiProperty({
        type: "string",
        enum: KycRejectType,
        required: false,
    })
    reviewRejectType?: KycRejectType;
}

export class ApplicantReviewedRequest extends SumSubWebhookRequest {
    @ApiProperty({
        enum: [applicantReviewed],
        required: true,
    })
    type: applicantReviewedType;

    @ApiProperty({
        enum: [KycStatus.COMPLETED],
        required: true,
    })
    reviewStatus: KycStatus.COMPLETED;

    @ApiProperty({
        type: () => ReviewResultProp,
        required: true,
    })
    reviewResult: ReviewResultProp;
}
