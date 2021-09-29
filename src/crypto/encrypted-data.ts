export class Encrypted<T> {
    constructor(
        public iv: string,
        public data: string,
        public mac: string,
        public hash: string
    ) {}

    serialize(): string {
        return `${this.iv}:${this.data}:${this.mac}:${this.hash}`;
    }

    static deserialize<T>(serialized: string): Encrypted<T> {
        const [iv, data, mac, hash] = serialized.split(":");
        return new Encrypted(iv, data, mac, hash);
    }
}
