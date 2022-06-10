import { Inject } from "@nestjs/common";
import { TRANSACTION_MODULE_OPTIONS } from "./transaction.constants";
import { TransactionModuleOptions } from "./transaction.module";

export class TransactionService {
    constructor(
        @Inject(TRANSACTION_MODULE_OPTIONS) private readonly options: TransactionModuleOptions,
    ) {}
}
