import { IBlockchainService } from "./blockchain-service";
import { ethers } from "ethers";
import { TransactionStatus } from "../transaction.dto";

export class EvmService implements IBlockchainService {
    public readonly provider: ethers.providers.JsonRpcProvider;

    constructor(rpcUrl: string) {
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    }

    async getBalance(address: string): Promise<number> {
        const balance = await this.provider.getBalance(address);
        return Number(ethers.utils.formatEther(balance));
    }

    async broadcast(payload: string): Promise<void> {
        await this.provider.sendTransaction(payload);
    }

    async getReceipt(transactionHash: string): Promise<string | undefined> {
        const transactionReceipt = await this.provider.getTransactionReceipt(transactionHash);
        if (!transactionReceipt) return undefined;
        else return JSON.stringify(transactionReceipt);
    }

    async checkStatus(transactionHash: string): Promise<TransactionStatus> {
        const transactionReceipt = await this.provider.getTransactionReceipt(transactionHash);
        if (!transactionReceipt) return TransactionStatus.UNCONFIRMED;
        if (transactionReceipt.status === 0) return TransactionStatus.FAILED;
        if (transactionReceipt.confirmations >= 1) return TransactionStatus.CONFIRMED;
        else return TransactionStatus.UNCONFIRMED;
    }
}
