import { ApiProperty } from "@nestjs/swagger";

export class ApiError {
    @ApiProperty({ required: true, type: Number })
    statusCode: number;
    @ApiProperty({ required: true, type: String })
    message: string;
}
