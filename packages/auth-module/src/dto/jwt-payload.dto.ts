import { UserType } from "../entities/AuthUser";

export interface JwtPayloadDTOI {
    email: string;
    id: number;
    type: UserType | string;
    isTwoFactorAuthenticated?: boolean;
    needs2fa?: boolean;
}
