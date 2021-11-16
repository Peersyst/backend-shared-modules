import {CACHE_MANAGER, HttpService, Inject, Injectable} from "@nestjs/common";
import {Cache, CachingConfig} from "cache-manager";

@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, @Inject(HttpService) private readonly http: HttpService) {}

    public async cacheGet<T>(callId: string, url: string, headers: { [key: string]: string }, ttl?: number): Promise<T> {
        const cached = await this.cacheManager.get<T>(callId);
        if (cached) {
            return cached;
        }

        const response = await this.http.get(url, {
            headers,
        }).toPromise();
        if (response.status < 300) {
            await this.cacheManager.set(callId, response.data, {
                ttl: ttl || 60*5, // default ttl 5 min
            });
            return response.data;
        } else {
            throw new Error(`Error in Get request ${callId}`);
        }
    }
}
