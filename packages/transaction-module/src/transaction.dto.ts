import { Transaction, TransactionStatus } from "./entities/Transaction";

export class TransactionDto {
    public id: number;
    public type: string; // TODO: make generic
    public from: string;
    public to: string;
    public amount: string;
    public payload: string; // Signed transaction
    public hash: string;
    public status: TransactionStatus;
    public createdAt: number;
    public errorMessage?: string;

    static fromEntity(transaction: Transaction): TransactionDto {
        return {
            id: transaction.id,
            type: transaction.type,
            from: transaction.from,
            to: transaction.to,
            amount: transaction.amount,
            payload: transaction.payload,
            hash: transaction.hash || undefined,
            status: transaction.status,
            createdAt: transaction.createdAt.getTime(),
            errorMessage: transaction.errorMessage || undefined,
        };
    }
}
