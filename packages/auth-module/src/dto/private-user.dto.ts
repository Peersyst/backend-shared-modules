import { UserType } from "../entities/AuthUser";

export interface PrivateAuthUserDtoI {
    id: number;
    email: string;
    type: UserType | string;
}
