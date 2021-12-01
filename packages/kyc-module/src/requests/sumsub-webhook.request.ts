import { ApiProperty } from "@nestjs/swagger";

export class SumSubWebhookRequest {
    @ApiProperty({
        type: "string",
        required: true,
    })
    applicantId: string;

    @ApiProperty({
        type: "string",
        required: true,
    })
    inspectionId: string;

    @ApiProperty({
        type: "string",
        required: true,
    })
    correlationId: string;

    @ApiProperty({
        type: "string",
        required: true,
    })
    externalUserId: string;

    @ApiProperty({
        type: "string",
        required: true,
    })
    createdAt: string;

    @ApiProperty({
        type: "string",
        required: false,
    })
    applicantType?: string;

    @ApiProperty({
        type: "string",
        required: true,
    })
    type: string;
}
