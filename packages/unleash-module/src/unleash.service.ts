import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { startUnleash, Unleash } from "unleash-client"

@Injectable()
export class UnleashService implements OnModuleInit {
    private unleash: Unleash;

    constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

    async onModuleInit(): Promise<void> {
        this.unleash = await startUnleash({
            appName: this.configService.get("unleash.appName"),
            url: this.configService.get("unleash.url"),
            environment: this.configService.get("unleash.environment"),
            customHeaders: {
                Authorization: this.configService.get("unleash.apiToken"),
            },
        });
    }

    getUnleash(): Unleash {
        return this.unleash;
    }
}