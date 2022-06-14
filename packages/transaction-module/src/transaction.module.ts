import { DynamicModule, Module, Provider, Type, ForwardReference, Global, ModuleMetadata } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import {TRANSACTION_MODULE_OPTIONS} from "./transaction.constants";
import { BullModule } from "@nestjs/bull";
import { BlockchainNetwork } from "./blockchain-network.enum";

export interface TransactionModuleOptions {
    network: BlockchainNetwork;
    config: any; // TODO: union type of all possible config types?
}

export interface TransactionOptionsFactory {
    createIpfsOptions(): Promise<TransactionModuleOptions> | TransactionModuleOptions;
}

export interface TransactionModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    useExisting?: Type<TransactionOptionsFactory>;
    useClass?: Type<TransactionOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<TransactionModuleOptions> | TransactionModuleOptions;
    inject?: any[];
}

export function createProvider(options: TransactionModuleOptions): any[] {
    return [{ provide: TRANSACTION_MODULE_OPTIONS, useValue: options || {} }];
}

@Global()
@Module({})
export class TransactionModule {
    static register(options: TransactionModuleOptions): DynamicModule {
        return {
            imports: [
                BullModule.registerQueue({
                    name: "transaction-queue",
                }),
            ],
            module: TransactionModule,
            global: true,
            providers: createProvider(options)
        };
    }

    static registerAsync(options: TransactionModuleAsyncOptions): DynamicModule {
        return {
            module: TransactionModule,
            global: true,
            imports: [
                BullModule.registerQueue({
                    name: "transaction-queue",
                }),
                ...(options.imports || []),
            ],
            providers: [
                ...this.createAsyncProviders(options),
                TransactionService,
            ],
            exports: [TransactionService],
        };
    }

    private static createAsyncProviders(
        options: TransactionModuleAsyncOptions
    ): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass
            }
        ];
    }

    private static createAsyncOptionsProvider(
        options: TransactionModuleAsyncOptions
    ): Provider {
        if (options.useFactory) {
            return {
                provide: TRANSACTION_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: TRANSACTION_MODULE_OPTIONS,
            useFactory: async (optionsFactory: TransactionOptionsFactory) =>
                await optionsFactory.createIpfsOptions(),
            inject: [options.useExisting || options.useClass]
        };
    }
}


