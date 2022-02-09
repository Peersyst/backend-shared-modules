import { UserType, WithUserType } from "../entities/AuthUser";

export interface PrivateAuthUserDtoI<T = UserType> {
    id: number;
    email: string;
    type: WithUserType<T> | string;
    blocked?: boolean;
}
