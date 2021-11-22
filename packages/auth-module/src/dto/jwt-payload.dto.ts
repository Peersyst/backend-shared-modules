import { UserType, WithUserType } from "../entities/AuthUser";

export interface JwtPayloadDTOI<T = UserType> {
    email: string;
    id: number;
    type: WithUserType<T> | string;
    isTwoFactorAuthenticated?: boolean;
    needs2fa?: boolean;
}
