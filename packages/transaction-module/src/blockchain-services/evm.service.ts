import { TransactionStatus } from "../entities/Transaction";
import { IBlockchainService } from "./blockchain-service";

export class EvmService implements IBlockchainService {

    constructor(rpcUrl: string) {
        // TODO:
    }
    
    async getBalance(address: string): Promise<number> {
        // TODO:
        return 0;
    }

    async broadcast(payload: string): Promise<void> {
        // TODO:
    }

    async checkStatus(transactionHash: string): Promise<TransactionStatus> {
        // TODO:
        return TransactionStatus.PENDING;
    }
}