export enum UserType {
    ADMIN = "admin",
    USER = "user",
}
export type WithUserType<T> = T & UserType;

export enum TwoFactorType {
    EMAIL = "email",
    AUTHENTICATOR = "authenticator",
}

export interface AuthUserI<T = UserType> {
    id: number;
    email: string;
    type: WithUserType<T> | string;
    password: string;
    blocked?: boolean;
}

export interface Auth2FAUserI {
    needs2fa: boolean;
    twoFactorType: Required<TwoFactorType> | null;
    authenticatorSecret: string | null;
}

export interface AuthGoogleUserI {
    googleAuth: boolean;
    name: string;
}

export interface AuthTwitterUserI {
    twitterAuth: boolean;
    name: string;
}

export interface ValidateEmailUserI {
    emailVerified?: boolean;
}
