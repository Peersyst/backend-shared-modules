export enum AuthType {
    EMAIL = "email",
    GOOGLE = "google",
    TWITTER = "twitter",
}

export interface ThirdPartyUserDto {
    email: string;
    name: string;
    accessToken: string;
}
