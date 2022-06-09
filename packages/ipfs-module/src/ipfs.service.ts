import { Inject, Injectable } from "@nestjs/common";
import * as IPFS from "ipfs";
import * as fs from "fs";
import { pinFileToIPFS } from "./pinata";
import { IPFS_MODULE_OPTIONS } from "./ipfs.constants";
import { IpfsModuleOptions } from "./ipfs.module";

@Injectable()
export class IpfsService {
    private ipfsNode: any;
    private createPromise: Promise<void>;

    constructor(
        @Inject(IPFS_MODULE_OPTIONS) private readonly options: IpfsModuleOptions
    ) {
        this.createPromise = IPFS.create().then(async (node) => {
            this.ipfsNode = node;
        });
    }

    async uploadFile(fileBuffer: Buffer): Promise<string> {
        await this.createPromise;
        if (this.options.pinataApiKey) {
            const name = Date.now().toString();
            fs.writeFileSync("./" + name, fileBuffer);
            const stream = fs.createReadStream("./" + name);
            const result = await pinFileToIPFS(this.options.pinataApiKey, this.options.pinataSecret, stream);
            fs.rmSync("./" + name);
            return result.IpfsHash;
        } else {
            const file = await this.ipfsNode.add(fileBuffer);
            console.log(`Added file ${file.cid}`);
            return file.cid.toString();
        }
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
