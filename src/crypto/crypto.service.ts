import * as crypto from "crypto";
import {Inject, Injectable} from "@nestjs/common";
import {EncryptedData} from "./encrypted-data";
import {CRYPTO_MODULE_OPTIONS} from "./crypto.constants";
import {CryptoModuleOptions} from "./crypto.module";

@Injectable()
export class CryptoService {
    private readonly encryptionKey: Buffer;
    private readonly ALGORITHM = "aes-256-gcm";

    constructor(
        @Inject(CRYPTO_MODULE_OPTIONS) private readonly options: CryptoModuleOptions
    ) {
        // Key is a base64 encoded 256bit key (32 bytes)
        this.encryptionKey = Buffer.from(options.encryptionKey, "base64");
    }

    public encrypt(text: string): EncryptedData {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.ALGORITHM, this.encryptionKey, iv);
        let enc = cipher.update(text, "utf8", "base64");
        enc += cipher.final("base64");

        const hash = crypto.createHash("sha256").update(text, "utf8").digest().toString("base64");

        return new EncryptedData(
            iv.toString("base64"),
            enc,
            cipher.getAuthTag().toString("base64"),
            hash,
        );
    }

    public decrypt(enc: EncryptedData): string {
        const decipher = crypto.createDecipheriv(this.ALGORITHM, this.encryptionKey, Buffer.from(enc.iv, "base64"));
        decipher.setAuthTag(Buffer.from(enc.mac, "base64"));
        let str = decipher.update(enc.data, "base64", "utf8");
        str += decipher.final("utf8");
        return str;
    }

    public encryptFile(data: Buffer): Buffer {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.ALGORITHM, this.encryptionKey, iv);
        const encryptedBuffer = Buffer.concat([cipher.update(data), cipher.final()]);
        const authTag = cipher.getAuthTag();
        const bufferLength = Buffer.alloc(1);
        bufferLength.writeUInt8(iv.length, 0);
        return Buffer.concat([bufferLength, iv, authTag, encryptedBuffer]);
        /*const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.ALGORITHM, this.encryptionKey, iv);
        return Buffer.concat([iv, cipher.update(data), cipher.final()]);*/
    }

    public decryptFile(data: Buffer): Buffer {
        const ivSize = data.readUInt8(0);
        const iv = data.slice(1, ivSize + 1);
        // The authTag is by default 16 bytes in AES-GCM
        const authTag = data.slice(ivSize + 1, ivSize + 17);
        const decipher = crypto.createDecipheriv(this.ALGORITHM, this.encryptionKey, iv);
        decipher.setAuthTag(authTag);
        return Buffer.concat([decipher.update(data.slice(ivSize + 17)), decipher.final()]);
        /*const iv = data.slice(0, 16);
        const chunk = data.slice(16);
        const decipher = crypto.createDecipheriv(this.ALGORITHM, this.encryptionKey, iv);
        return Buffer.concat([decipher.update(chunk), decipher.final()]);*/
    }
}
