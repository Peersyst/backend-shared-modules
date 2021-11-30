import { ApiProperty } from "@nestjs/swagger";

export class ValidateEmailRequest {
    @ApiProperty({
        type: "string",
        required: true,
    })
    token: string;
}
