import {CacheModule, DynamicModule, Global, HttpModule, Module} from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({})
export class RedisCacheModule {
    static register(redisHost: string, redisPort: number): DynamicModule {
        return {
            module: RedisCacheModule,
            imports: [
                CacheModule.register({
                    store: redisStore,
                    // Store-specific configuration:
                    host: redisHost,
                    port: redisPort,
                  }),
                HttpModule,
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