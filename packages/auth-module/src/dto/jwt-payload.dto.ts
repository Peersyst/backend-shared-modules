import { UserType } from "../entities/AuthUser";

export interface JwtPayloadDTOI {
    email: string;
    id: number;
    type: UserType;
    isTwoFactorAuthenticated?: boolean;
    needs2fa?: boolean;
}
