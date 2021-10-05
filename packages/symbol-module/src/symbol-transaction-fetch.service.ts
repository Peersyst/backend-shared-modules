import {SymbolFactoryService} from "./symbol-factory.service";
import {Transaction, TransactionGroup} from "symbol-sdk";

export class SymbolTransactionFetchService {
    constructor(
        private readonly symbolFactory: SymbolFactoryService,
    ) {}

    async fetchTransaction(hash: string): Promise<Transaction | null> {
        const transactionHttp = this.symbolFactory.repositoryFactoryHttp.createTransactionRepository();
        try {
            return await transactionHttp.getTransaction(hash, TransactionGroup.Confirmed).toPromise();
            // eslint-disable-next-line no-empty
        } catch {}
        try {
            return await transactionHttp.getTransaction(hash, TransactionGroup.Partial).toPromise();
            // eslint-disable-next-line no-empty
        } catch {}
        try {
            return await transactionHttp.getTransaction(hash, TransactionGroup.Unconfirmed).toPromise();
            // eslint-disable-next-line no-empty
        } catch {}
        return null;
    }
}
