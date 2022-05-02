import { Inject, Injectable } from "@nestjs/common";
import * as IPFS from "ipfs";

@Injectable()
export class IpfsService {
    private ipfsNode: any;

    constructor() {
        IPFS.create().then(async (node) => {
            this.ipfsNode = node;
        });
    }

    async uploadFile(fileBuffer: Buffer): Promise<string> {
        const { cid } = await this.ipfsNode.add(fileBuffer);
        await this.ipfsNode.pin.add(cid.toString());
        console.log(`Added file ${cid}`);
        return cid.toString();
    }

    async getFile(cid: string): Promise<Buffer> {
        const response: Uint8Array = await this.ipfsNode.get(cid);
        return Buffer.from(response);
    }
}
