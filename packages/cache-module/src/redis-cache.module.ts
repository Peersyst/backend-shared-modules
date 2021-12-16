import {CacheModule, DynamicModule, Global, Module, ModuleMetadata, Provider, Type} from "@nestjs/common";
import { RedisCacheService } from "./redis-cache.service";
import * as redisStore from "cache-manager-redis-store";

export interface RedisCacheModuleOptions {
    redisHost: string;
    redisPort: number;
    redisPassword: string;
}

export interface RedisCacheOptionsFactory {
    createCacheOptions(): Promise<RedisCacheModuleOptions> | RedisCacheModuleOptions;
}

export interface RedisCacheModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    useExisting?: Type<RedisCacheOptionsFactory>;
    useClass?: Type<RedisCacheOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<RedisCacheModuleOptions> | RedisCacheModuleOptions;
    inject?: any[];
}

@Global()
@Module({})
export class RedisCacheModule {
    static register(options: RedisCacheModuleOptions): DynamicModule {
        return {
            module: RedisCacheModule,
            imports: [
                CacheModule.register({
                    store: redisStore,
                    host: options.redisHost,
                    port: options.redisPort,
                    auth_pass: options.redisPassword,
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

    static registerAsync(options: RedisCacheModuleAsyncOptions): DynamicModule {
        return {
            module: RedisCacheModule,
            imports: options.imports || [],
            providers: [RedisCacheService],
            exports: [RedisCacheService],
        };
    }
}