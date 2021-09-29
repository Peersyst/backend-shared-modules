export class EncryptedData<T> {
    constructor(
        public iv: string,
        public data: string,
        public mac: string,
        public hash: string
    ) {}

    serialize(): string {
        return `${this.iv}:${this.data}:${this.mac}:${this.hash}`;
    }

    static deserialize<T>(serialized: string): EncryptedData<T> {
        const [iv, data, mac, hash] = serialized.split(":");
        return new EncryptedData(iv, data, mac, hash);
    }
}
