import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordRequest {
    @ApiProperty({
        type: "string",
        description: "Min 8, at least 1 uppercase, 1 lowercase, 1 special( !@$%^&(){}[]:;<>,.?/~_+-=| ) characters",
        required: true,
    })
    currentPassword: string;

    @ApiProperty({
        type: "string",
        description: "at least 8 characters long, 1 uppercase & 1 lowercase letter, 1 number, 1 special character",
        required: true,
        pattern: "(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\W_]).*",
    })
    newPassword: string;
}
