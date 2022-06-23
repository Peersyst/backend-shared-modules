import { forwardRef, Inject, Logger } from "@nestjs/common";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { TransactionService } from "../transaction.service";
import { TransactionStatus } from "../transaction.dto";

export enum TransactionConditionType {
    BALANCE_BIGGER_THAN = "balance_bigger_than",
}

export interface ProcessTransaction {
    precondition?: {
        type: TransactionConditionType;
        params: { [key: string]: any };
    };
    transactionId: number;
}

export interface ConfirmTransaction {
    transactionId: number;
}

@Processor("transaction-queue")
export class TransactionConsumer {
    private readonly logger = new Logger(TransactionConsumer.name);

    constructor(@Inject(forwardRef(() => TransactionService)) private readonly transactionService: TransactionService) {}

    @Process("process-transaction")
    async processTransaction(job: Job<ProcessTransaction>): Promise<void> {
        this.logger.log(`Processing Transaction ${job.data.transactionId}`);
        try {
            if (job.data.precondition) {
                const precondition = await this.transactionService.checkCondition(job.data.precondition.type, job.data.precondition.params);
                if (!precondition) {
                    await this.transactionService.sendTransactionToProcessQueue(job.data.transactionId, 2000, job.data.precondition);
                    return;
                }
            }
            await this.transactionService.broadcast(job.data.transactionId);
            this.logger.log(`Transaction ${job.data.transactionId} processed`);
        } catch (e) {
            await this.transactionService.rejectTransaction(job.data.transactionId, e.message);
            this.logger.error("Transaction in queue error: " + e.toString());
        }
    }

    @Process("confirm-transaction")
    async confirmTransaction(job: Job<ConfirmTransaction>): Promise<void> {
        this.logger.log(`Checking transaction status ${job.data.transactionId}`);
        try {
            const status = await this.transactionService.checkTransactionStatus(job.data.transactionId);
            if (status === TransactionStatus.CONFIRMED) {
                await this.transactionService.confirmTransaction(job.data.transactionId);
                this.logger.log(`Transaction ${job.data.transactionId} confirmed`);
                return;
            } else if (status === TransactionStatus.FAILED) {
                await this.transactionService.rejectTransaction(job.data.transactionId, "Transaction failed after sending");
                return;
            } else {
                const transaction = await this.transactionService.findById(job.data.transactionId);
                if (Date.now() - transaction.createdAt > 60000 * 60 * 2) {
                    // Transaction Older than 2h -> Reject by timeout
                    await this.transactionService.rejectTransaction(job.data.transactionId, "Confirm queue time limit reached");
                } else if (Date.now() - transaction.createdAt > 60000 * 10) {
                    // Transaction Older than 10 min -> Only check every 30 seconds
                    await this.transactionService.sendTransactionToConfirmQueue(job.data.transactionId, 30000);
                } else {
                    await this.transactionService.sendTransactionToConfirmQueue(job.data.transactionId, 5000);
                }
                return;
            }
        } catch (e) {
            await this.transactionService.rejectTransaction(job.data.transactionId, e.message);
            this.logger.error("Transaction status queue error: " + e.toString());
        }
    }
}
