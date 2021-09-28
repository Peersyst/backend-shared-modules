import {SymbolFactoryService} from "./symbol-factory.service";
import {Account, AggregateTransaction, SignedTransaction, Transaction} from "symbol-sdk";

export class SymbolTransactionSignerService {
    constructor(
        private readonly symbolFactory: SymbolFactoryService,
    ) {}

    async signTransaction(transaction: Transaction, account: Account): Promise<SignedTransaction> {
        return account.sign(transaction, this.symbolFactory.generationHash);
    }

    async signTransactionWithCosignatories(transaction: AggregateTransaction, signer: Account, cosignatories: Account[]): Promise<SignedTransaction> {
        return signer.signTransactionWithCosignatories(transaction, cosignatories, this.symbolFactory.generationHash);
    }
}
