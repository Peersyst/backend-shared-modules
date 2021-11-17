import {CacheModule, DynamicModule, Global, Module, ModuleMetadata, Provider, Type} from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import * as redisStore from 'cache-manager-redis-store';
import {REDIS_CACHE_MODULE_OPTIONS} from "./redis-cache.constants";

export interface CacheModuleOptions {
    redisHost: string;
    redisPort: number;
}

export interface CacheOptionsFactory {
    createCacheOptions(): Promise<CacheModuleOptions> | CacheModuleOptions;
}

export interface CacheModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<CacheOptionsFactory>;
    useClass?: Type<CacheOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<CacheModuleOptions> | CacheModuleOptions;
    inject?: any[];
}

@Global()
@Module({})
export class RedisCacheModule {
    static register(options: CacheModuleOptions): DynamicModule {
        return {
            module: RedisCacheModule,
            imports: [
                CacheModule.register({
                    store: redisStore,
                    host: options.redisHost,
                    port: options.redisPort,
                  }),
            ],
            providers: [
                RedisCacheService,
            ],
            exports: [
                RedisCacheService,
            ],
        };
    }

    static registerAsync(options: CacheModuleAsyncOptions): DynamicModule {
        return {
            module: RedisCacheModule,
            global: true,
            imports: options.imports || [],
            providers: [
                ...this.createAsyncProviders(options),
                RedisCacheService,
            ],
            exports: [RedisCacheService],
        };
    }

    private static createAsyncProviders(
        options: CacheModuleAsyncOptions
    ): Provider[] {
        if (options.useFactory) {
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
        options: CacheModuleAsyncOptions
    ): Provider {
        if (options.useFactory) {
            return {
                provide: REDIS_CACHE_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: REDIS_CACHE_MODULE_OPTIONS,
            useFactory: async (optionsFactory: CacheOptionsFactory) =>
                await optionsFactory.createCacheOptions(),
            inject: [options.useExisting || options.useClass]
        };
    }
}