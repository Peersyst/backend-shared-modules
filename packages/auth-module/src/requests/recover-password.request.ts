import { ApiProperty } from "@nestjs/swagger";

export class RecoverPasswordRequest<TSource> {
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
    source: TSource;
}
