import { DynamicModule, Module, Provider, Type, ForwardReference, Global, ModuleMetadata } from "@nestjs/common";
import { IpfsService } from "./ipfs.service";
import {IPFS_MODULE_OPTIONS} from "./ipfs.constants";

export interface IpfsModuleOptions {
    pinataApiKey?: string;
    pinataSecret?: string;
}

export interface IpfsOptionsFactory {
    createIpfsOptions(): Promise<IpfsModuleOptions> | IpfsModuleOptions;
}

export interface IpfsModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    useExisting?: Type<IpfsOptionsFactory>;
    useClass?: Type<IpfsOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<IpfsModuleOptions> | IpfsModuleOptions;
    inject?: any[];
}

export function createCryptoProvider(options: IpfsModuleOptions): any[] {
    return [{ provide: IPFS_MODULE_OPTIONS, useValue: options || {} }];
}

@Global()
@Module({})
export class IpfsModule {
    static register(options: IpfsModuleOptions): DynamicModule {
        return {
            module: IpfsModule,
            global: true,
            providers: createCryptoProvider(options)
        };
    }

    static registerAsync(options: IpfsModuleAsyncOptions): DynamicModule {
        return {
            module: IpfsModule,
            global: true,
            imports: options.imports || [],
            providers: [
                ...this.createAsyncProviders(options),
                IpfsService,
            ],
            exports: [IpfsService],
        };
    }

    private static createAsyncProviders(
        options: IpfsModuleAsyncOptions
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
        options: IpfsModuleAsyncOptions
    ): Provider {
        if (options.useFactory) {
            return {
                provide: IPFS_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: IPFS_MODULE_OPTIONS,
            useFactory: async (optionsFactory: IpfsOptionsFactory) =>
                await optionsFactory.createIpfsOptions(),
            inject: [options.useExisting || options.useClass]
        };
    }
}


