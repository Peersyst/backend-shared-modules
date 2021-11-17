import {CacheModule, DynamicModule, Global, Module, ModuleMetadata, Provider, Type} from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import * as redisStore from 'cache-manager-redis-store';
import {REDIS_CACHE_MODULE_OPTIONS} from "./redis-cache.constants";

export interface RedisCacheModuleOptions {
    redisHost: string;
    redisPort: number;
    redisPassword: string;
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
}