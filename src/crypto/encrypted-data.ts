export class EncryptedData {
    constructor(
        public iv: string,
        public data: string,
        public mac: string,
        public hash: string
    ) {}

    serialize(): string {
        return `${this.iv}:${this.data}:${this.mac}:${this.hash}`;
    }

    static deserialize(serialized: string): EncryptedData {
        const [iv, data, mac, hash] = serialized.split(":");
        return new EncryptedData(iv, data, mac, hash);
    }
}
