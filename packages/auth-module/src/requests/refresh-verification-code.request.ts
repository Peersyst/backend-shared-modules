import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshVerificationTokenRequest {
    @ApiProperty({
        type: "number",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    userId: number;
}
