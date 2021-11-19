export enum AuthType {
    EMAIL = "email",
    GOOGLE = "google",
    TWITTER = "twitter",
}

export interface ThirdPartyUserDtoI {
    email: string;
    name: string;
    accessToken: string;
}
