import { DynamicModule, Global, Module, ModuleMetadata, Provider, Type } from "@nestjs/common";
import { CONFIG_MODULE_OPTIONS } from "./config.constants";

export interface ConfigModuleOptions {
    aws?: {
        region: string;
        secretName: string;
    }
}

export interface ConfigModuleOptionsFactory {
    createConfigModuleOptions(): Promise<ConfigModuleOptions> | ConfigModuleOptions;
}

export interface ConfigModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    useExisting?: Type<ConfigModuleOptionsFactory>;
    useClass?: Type<ConfigModuleOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<ConfigModuleOptions> | ConfigModuleOptions;
    inject?: any[];
}

export function createConfigOptionsProvider(options: ConfigModuleOptions): Provider[] {
    return [{ provide: CONFIG_MODULE_OPTIONS, useValue: options || {} }];
}

const ConfigModuleProviders: Provider[] = [];

@Global()
@Module({})
export class ConfigModule {
    static register(options: ConfigModuleOptions): DynamicModule {
        return {
            module: ConfigModule,
            global: true,
            providers: [
                ...createConfigOptionsProvider(options),
                ...ConfigModuleProviders,
            ],
            exports: ConfigModuleProviders,
        };
    }

    static registerAsync(options: ConfigModuleAsyncOptions): DynamicModule {
        return {
            module: ConfigModule,
            global: true,
            imports: options.imports || [],
            providers: [
                ...this.createAsyncProviders(options),
                ...ConfigModuleProviders,
            ],
            exports: ConfigModuleProviders,
        };
    }

    private static createAsyncProviders(
        options: ConfigModuleAsyncOptions
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
        options: ConfigModuleAsyncOptions
    ): Provider {
        if (options.useFactory) {
            return {
                provide: CONFIG_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: CONFIG_MODULE_OPTIONS,
            useFactory: async (optionsFactory: ConfigModuleOptionsFactory) =>
                await optionsFactory.createConfigModuleOptions(),
            inject: [options.useExisting || options.useClass]
        };
    }
}
