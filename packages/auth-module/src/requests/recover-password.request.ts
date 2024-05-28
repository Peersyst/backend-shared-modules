import { ApiProperty } from "@nestjs/swagger";
import { Source } from "src/types";

export class RecoverPasswordRequest {
    @ApiProperty({
        type: "string",
        required: true,
        format: "email",
    })
    email: string;

    @ApiProperty({
        type: "string",
        required: true,
    })
    source: Source;
}
