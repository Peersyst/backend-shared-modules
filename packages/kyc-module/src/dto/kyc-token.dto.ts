import { ApiProperty } from "@nestjs/swagger";

export interface KycTokenDtoI {
    accessToken: string;
}

export class KycTokenDto implements KycTokenDtoI {
    @ApiProperty()
    accessToken: string;
}
