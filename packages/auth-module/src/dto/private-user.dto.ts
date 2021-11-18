import { UserType } from "../entities/AuthUser";

export interface PrivateUserDto {
    id: number;
    email: string;
    type: UserType;
}
