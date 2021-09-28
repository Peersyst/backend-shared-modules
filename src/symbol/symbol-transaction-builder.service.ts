import {SymbolFactoryService} from "./symbol-factory.service";
import {
    Address, AggregateTransaction,
    Deadline, HashLockTransaction, InnerTransaction,
    Mosaic,
    MultisigAccountModificationTransaction, PlainMessage, SignedTransaction,
    Transaction,
    TransferTransaction, UInt64
} from "symbol-sdk";

export class SymbolTransactionBuilderService {
    constructor(
        private readonly symbolFactory: SymbolFactoryService,
    ) {}

    buildCreateMultisigAccountTransaction(cosignatories: Address[], minRemoval: number, minApproval: number): Transaction {
        return this.setTransactionFee(
            MultisigAccountModificationTransaction.create(
                Deadline.create(this.symbolFactory.epochAdjustment),
                minApproval,
                minRemoval,
                cosignatories,
                [],
                this.symbolFactory.networkType,
            )
        );
    }

    buildTransferTransaction(destination: Address, amount: number, message?: string): Transaction {
        return this.setTransactionFee(
            TransferTransaction.create(
                Deadline.create(this.symbolFactory.epochAdjustment),
                destination,
                [
                    new Mosaic(
                        this.symbolFactory.currencyMosaicId,
                        UInt64.fromUint(amount * Math.pow(10, this.symbolFactory.currencyMosaicDivisibility))
                    )
                ],
                message ? PlainMessage.create(message): null,
                this.symbolFactory.networkType,
            )
        );
    }

    buildAggregateBondedTransaction(transactions: InnerTransaction[]): AggregateTransaction {
        return this.setTransactionFee(
            AggregateTransaction.createBonded(
                Deadline.create(this.symbolFactory.epochAdjustment),
                transactions,
                this.symbolFactory.networkType
            )
        ) as AggregateTransaction;
    }

    buildHashLockTransaction(signedTransaction: SignedTransaction): Transaction {
        return this.setTransactionFee(
            HashLockTransaction.create(
                Deadline.create(this.symbolFactory.epochAdjustment),
                new Mosaic(
                    this.symbolFactory.currencyMosaicId,
                    UInt64.fromUint(10 * Math.pow(10, this.symbolFactory.currencyMosaicDivisibility)),
                ),
                UInt64.fromUint(480),
                signedTransaction,
                this.symbolFactory.networkType
            )
        );
    }

    setTransactionFee(transaction: Transaction): Transaction {
        return transaction.setMaxFee(200);
    }
}
