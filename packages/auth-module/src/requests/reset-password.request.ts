import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordRequest {
    @ApiProperty({
        type: "string",
        description: "at least 8 characters long, 1 uppercase & 1 lowercase letter, 1 number, 1 special character",
        required: true,
        pattern: "(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\W_]).*",
    })
    password: string;

    @ApiProperty({
        type: "string",
        required: true,
    })
    token: string;
}
