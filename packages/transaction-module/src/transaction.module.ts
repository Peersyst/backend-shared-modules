import { DynamicModule, Module, Provider, Type, ForwardReference, Global } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/Transaction";
import { BlockchainNetwork } from "./blockchain-network.enum";
import { TransactionConsumer } from "./queue/transaction.queue";
import { BullModule } from "@nestjs/bull";
import { TRANSACTION_MODULE_OPTIONS } from "./transaction.constants";

export interface TransactionModuleOptions {
    network: BlockchainNetwork;
}

@Global()
@Module({})
export class TransactionModule {
    static register(ConfigModule: Type, options?: TransactionModuleOptions): DynamicModule {
        const providers: Provider[] = [
            TransactionService,
            TransactionConsumer,
            {
                provide: TRANSACTION_MODULE_OPTIONS,
                useValue: options,
            },
            // Transaction,
        ];
        const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
            ConfigModule,
            BullModule.registerQueue({
                name: "transaction-queue",
            }),
            TypeOrmModule.forFeature([Transaction]),
        ];
        const exports: Provider[] = [TransactionService];

        return {
            module: TransactionModule,
            imports,
            providers,
            exports,
        };
    }
}


