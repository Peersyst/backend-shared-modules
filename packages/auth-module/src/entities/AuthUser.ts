export enum UserType {
    ADMIN = "admin",
    USER = "user",
}

export enum TwoFactorType {
    EMAIL = "email",
    AUTHENTICATOR = "authenticator",
}

export interface AuthUserI {
    id: number;
    email: string;
    type: UserType;
    password: string;
}

export interface Auth2FAUserI {
    needs2fa: boolean;
    twoFactorType: TwoFactorType | null;
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
