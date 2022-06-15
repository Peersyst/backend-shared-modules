import { Inject, Injectable } from "@nestjs/common";
import { TransactionConditionType } from "./queue/transaction.queue";
import { TRANSACTION_MODULE_OPTIONS } from "./transaction.constants";
import { TransactionModuleOptions } from "./transaction.module";
import { BusinessException } from "./exception/business.exception";
import { TransactionErrorCode } from "./exception/error-codes";
import { IBlockchainService } from "./blockchain-services/blockchain-service";
import { BlockchainNetwork } from "./blockchain-network.enum";
import { EvmService } from "./blockchain-services/evm.service";
import { RippleService } from "./blockchain-services/ripple.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "./entities/Transaction";
import { Repository } from "typeorm";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { ConfigService } from "@nestjs/config";
import { TransactionDto, TransactionStatus } from "./transaction.dto";

@Injectable()

export class TransactionService {
    private blockchainService: IBlockchainService;

    constructor(
        @Inject(TRANSACTION_MODULE_OPTIONS) options: TransactionModuleOptions,
        @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
        @InjectQueue("transaction-queue") private queue: Queue,
        @Inject(ConfigService) configService: ConfigService,

    ) {
        switch (options.network) {
            case BlockchainNetwork.EVM:
                this.blockchainService = new EvmService(configService.get("blockchain.rpcUrl"));
            case BlockchainNetwork.RIPPLE:
                this.blockchainService = new RippleService();
        }
    }

    async checkCondition(type: TransactionConditionType, params: { [key: string]: any }): Promise<boolean> {
        switch (type) {
            case TransactionConditionType.BALANCE_BIGGER_THAN:
                return this.balanceBiggerThan(params.balance, params.address);
            default:
                throw new BusinessException(TransactionErrorCode.CONDITION_TYPE_NOT_FOUND);
        }
    }

    async balanceBiggerThan(balance: number, address: string): Promise<boolean> {
        const currentBalance = await this.blockchainService.getBalance(address);
        return currentBalance >= balance;
    }

    async sendTransactionToProcessQueue(
        transactionId: number,
        delay: number,
        precondition?: { type: TransactionConditionType; params: { [key: string]: any } },
    ): Promise<void> {
        await this.transactionRepository.update(transactionId, { status: TransactionStatus.PENDING });
        await this.queue.add("process-transaction", { precondition, transactionId }, { delay });
    }

    async sendTransactionToConfirmQueue(transactionId: number, delay: number): Promise<void> {
        await this.transactionRepository.update(transactionId, { status: TransactionStatus.UNCONFIRMED });
        await this.queue.add("confirm-transaction", { transactionId }, { delay });
    }

    async confirmTransaction(id: number): Promise<void> {
        await this.transactionRepository.update(id, { status: TransactionStatus.CONFIRMED });
    }

    async rejectTransaction(id: number, error: string): Promise<void> {
        await this.transactionRepository.update(id, { status: TransactionStatus.FAILED, errorMessage: error });
    }

    async broadcast(transactionId: number): Promise<void> {
        await this.transactionRepository.update(transactionId, { status: TransactionStatus.UNCONFIRMED });
        const transaction = await this.transactionRepository.findOne({ where: { id: transactionId } });
        await this.blockchainService.broadcast(transaction.payload);
        await this.sendTransactionToConfirmQueue(transactionId, 2000);
    }

    async checkTransactionStatus(transactionId: number): Promise<TransactionStatus> {
        const transaction = await this.transactionRepository.findOne({ where: { id: transactionId } });
        return await this.blockchainService.checkStatus(transaction.hash);
    }

    async findById(transactionId: number): Promise<TransactionDto> {
        const transaction = await this.transactionRepository.findOne({ where: { id: transactionId } });
        if (!transaction) {
            throw new BusinessException(TransactionErrorCode.TRANSACTION_NOT_FOUND);
        }
        return TransactionDto.fromEntity(transaction);
    }
}
