import { UserType } from "../entities/AuthUser";

export interface JwtPayloadDTO {
    email: string;
    id: number;
    type: UserType;
    isTwoFactorAuthenticated?: boolean;
    needs2fa?: boolean;
}
