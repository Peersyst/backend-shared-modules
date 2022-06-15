import { TransactionStatus } from "../transaction.dto";

export interface IBlockchainService {
    getBalance(address: string): Promise<number>;
    broadcast(payload: string): Promise<void>;
    checkStatus(transactionHash: string): Promise<TransactionStatus>;
}