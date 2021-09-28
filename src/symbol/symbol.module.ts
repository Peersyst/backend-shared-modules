import {DynamicModule, Global, Module, ModuleMetadata, Provider, Type} from '@nestjs/common';
import {SYMBOL_MODULE_OPTIONS} from "./symbol.constants";
import {NetworkType} from "symbol-sdk";
import {SymbolFactoryService} from "./symbol-factory.service";
import {SymbolTransactionBroadcastService} from "./symbol-transaction-broadcast.service";
import {SymbolTransactionBuilderService} from "./symbol-transaction-builder.service";
import {SymbolTransactionFetchService} from "./symbol-transaction-fetch.service";
import {SymbolTransactionSignerService} from "./symbol-transaction-signer.service";

export interface SymbolModuleOptions {
    node: string;
    networkType: NetworkType;
}

export interface SymbolModuleOptionsFactory {
    createSymbolModuleOptions(): Promise<SymbolModuleOptions> | SymbolModuleOptions;
}

export interface SymbolModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<SymbolModuleOptionsFactory>;
    useClass?: Type<SymbolModuleOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<SymbolModuleOptions> | SymbolModuleOptions;
    inject?: any[];
}

export function createSymbolOptionsProvider(options: SymbolModuleOptions): Provider[] {
    return [{ provide: SYMBOL_MODULE_OPTIONS, useValue: options || {} }];
}

const symbolModuleProviders: Provider[] = [
    SymbolFactoryService,
    SymbolTransactionBroadcastService,
    SymbolTransactionBuilderService,
    SymbolTransactionFetchService,
    SymbolTransactionSignerService
];

@Global()
@Module({})
export class SymbolModule {
    static register(options: SymbolModuleOptions): DynamicModule {
        return {
            module: SymbolModule,
            global: true,
            providers: [
                ...createSymbolOptionsProvider(options),
                ...symbolModuleProviders,
            ],
            exports: symbolModuleProviders,
        };
    }

    static registerAsync(options: SymbolModuleAsyncOptions): DynamicModule {
        return {
            module: SymbolModule,
            global: true,
            imports: options.imports || [],
            providers: [
                ...this.createAsyncProviders(options),
                ...symbolModuleProviders,
            ],
            exports: symbolModuleProviders,
        };
    }

    private static createAsyncProviders(
        options: SymbolModuleAsyncOptions
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
        options: SymbolModuleAsyncOptions
    ): Provider {
        if (options.useFactory) {
            return {
                provide: SYMBOL_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: SYMBOL_MODULE_OPTIONS,
            useFactory: async (optionsFactory: SymbolModuleOptionsFactory) =>
                await optionsFactory.createSymbolModuleOptions(),
            inject: [options.useExisting || options.useClass]
        };
    }
}