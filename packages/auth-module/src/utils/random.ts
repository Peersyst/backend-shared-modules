import * as crypto from "crypto";

export type Charset = "mayus" | "minus" | "numeric" | "all";

export const randomString = (length: number, charset?: Charset): string => {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    if (charset === "mayus") {
        characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    } else if (charset === "minus") {
        characters = "abcdefghijklmnopqrstuvwxyz";
    } else if (charset === "numeric") {
        characters = "0123456789";
    }

    let result = "";
    const rnd = crypto.randomBytes(length);
    const d = 256 / characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(rnd[i] / d));
    }
    return result;
};
