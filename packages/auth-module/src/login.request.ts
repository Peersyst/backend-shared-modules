import { ApiProperty } from "@nestjs/swagger";

export class LoginRequest {
    @ApiProperty({
        type: "string",
        required: true,
        format: "email",
    })
    email: string;

    @ApiProperty({
        type: "string",
        description: "Min 8, at least 1 uppercase, 1 lowercase, 1 special( !@$%^&(){}[]:;<>,.?/~_+-=| ) characters",
    })
    password: string;
}
