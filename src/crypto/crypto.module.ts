import {DynamicModule, Global, Module, ModuleMetadata, Provider, Type} from '@nestjs/common';
import {CryptoService} from "./crypto.service";
import {CRYPTO_MODULE_OPTIONS} from "./crypto.constants";

export interface CryptoModuleOptions {
    encryptionKey: string;
}

export interface CryptoOptionsFactory {
    createCryptoOptions(): Promise<CryptoModuleOptions> | CryptoModuleOptions;
}

export interface CryptoModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<CryptoOptionsFactory>;
    useClass?: Type<CryptoOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<CryptoModuleOptions> | CryptoModuleOptions;
    inject?: any[];
}

export function createCryptoProvider(options: CryptoModuleOptions): any[] {
    return [{ provide: CRYPTO_MODULE_OPTIONS, useValue: options || {} }];
}

@Global()
@Module({})
export class CryptoModule {
    static register(options: CryptoModuleOptions): DynamicModule {
        return {
            module: CryptoModule,
            global: true,
            providers: createCryptoProvider(options)
        };
    }

    static registerAsync(options: CryptoModuleAsyncOptions): DynamicModule {
        return {
            module: CryptoModule,
            global: true,
            imports: options.imports || [],
            providers: [
                ...this.createAsyncProviders(options),
                CryptoService,
            ],
            exports: [CryptoService],
        };
    }

    private static createAsyncProviders(
        options: CryptoModuleAsyncOptions
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
        options: CryptoModuleAsyncOptions
    ): Provider {
        if (options.useFactory) {
            return {
                provide: CRYPTO_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: CRYPTO_MODULE_OPTIONS,
            useFactory: async (optionsFactory: CryptoOptionsFactory) =>
                await optionsFactory.createCryptoOptions(),
            inject: [options.useExisting || options.useClass]
        };
    }
}