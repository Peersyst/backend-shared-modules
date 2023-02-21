import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshVerificationCode {
    @ApiProperty({
        type: "number",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    userId: number;
}
