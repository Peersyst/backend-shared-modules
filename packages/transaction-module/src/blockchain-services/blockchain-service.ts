import { TransactionStatus } from "../entities/Transaction";

export interface IBlockchainService {
    getBalance(address: string): Promise<number>;
    broadcast(payload: string): Promise<void>;
    checkStatus(transactionHash: string): Promise<TransactionStatus>;
}