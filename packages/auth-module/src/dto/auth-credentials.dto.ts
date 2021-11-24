import { ApiProperty } from "@nestjs/swagger";

export interface AuthCredentialsDtoI {
    access_token: string;
}

export class AuthCredentialsDto implements AuthCredentialsDtoI {
    @ApiProperty()
    access_token: string;
}
