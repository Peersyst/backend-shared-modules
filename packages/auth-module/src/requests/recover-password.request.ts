import { ApiProperty } from "@nestjs/swagger";

export class RecoverPasswordRequest {
    @ApiProperty({
        type: "string",
        required: true,
        format: "email",
    })
    email: string;
}
