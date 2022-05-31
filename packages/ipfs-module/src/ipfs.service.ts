import { Injectable } from "@nestjs/common";
import * as IPFS from "ipfs";

@Injectable()
export class IpfsService {
    private ipfsNode: any;
    private connectionPromise: Promise<void>;

    constructor() {
        this.connectionPromise = IPFS.create().then(async (node) => {
            this.ipfsNode = node;
        });
    }

    async uploadFile(fileBuffer: Buffer): Promise<string> {
        await this.connectionPromise;
        const file = await this.ipfsNode.add(fileBuffer);
        console.log(`Added file ${file.cid}`);
        return file.cid.toString();
    }

    async getFile(cid: string): Promise<Buffer> {
        await this.connectionPromise;
        const chunks = [];
        for await (const chunk of this.ipfsNode.cat(cid)) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }
}
