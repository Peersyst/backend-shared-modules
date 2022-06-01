import { Injectable } from "@nestjs/common";
import * as IPFS from "ipfs";

@Injectable()
export class IpfsService {
    private ipfsNode: any;
    private createPromise: Promise<void>;

    constructor() {
        this.createPromise = IPFS.create().then(async (node) => {
            this.ipfsNode = node;
        });
    }

    async uploadFile(fileBuffer: Buffer): Promise<string> {
        await this.createPromise;
        const file = await this.ipfsNode.add(fileBuffer);
        console.log(`Added file ${file.cid}`);
        return file.cid.toString();
    }

    async getFile(cid: string): Promise<Buffer> {
        await this.createPromise;
        const chunks = [];
        for await (const chunk of this.ipfsNode.cat(cid)) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }
}
