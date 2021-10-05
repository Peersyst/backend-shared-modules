import {SymbolFactoryService} from "./symbol-factory.service";
import {SignedTransaction} from "symbol-sdk";

export class SymbolTransactionBroadcastService {
    constructor(
        private readonly symbolFactory: SymbolFactoryService,
    ) {}

    announceTransaction(signedTransaction: SignedTransaction, onError?: (error: string) => void, onSuccess?: () => void) {
        const listener = this.symbolFactory.repositoryFactoryHttp.createListener();
        const transactionService = this.symbolFactory.transactionService;

        listener.open().then(() => {
            transactionService.announce(signedTransaction, listener).subscribe(
                undefined,
                onError,
                onSuccess,
            );
        });
    }
}
