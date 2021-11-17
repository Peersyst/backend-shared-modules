import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {Cache} from "cache-manager";

@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    public async cacheGet<T>(callId: string, callback: () => Promise<T>, ttl?: number): Promise<T> {
        const cached = await this.cacheManager.get<T>(callId);
        if (cached) {
            return cached;
        }

        const response = await callback();

        await this.cacheManager.set(callId, response, {
            ttl: ttl || 60*5, // default ttl 5 min
        });
        return response;
    }
}
