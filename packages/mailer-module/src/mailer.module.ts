import { DynamicModule, Module, Provider, Type } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { MAILER_MODULE_OPTIONS } from "./constants/mailer-options";
import { MailerModuleOptions } from "./types/mailer-options.types";

@Module({})
export class MailerModule {
    static forRootAsync(options: MailerModuleOptions): DynamicModule {
        const providers = this.createAsyncProviders(options);

        return {
            module: MailerModule,
            global: true,
            imports: options.imports,
            exports: [MailerService],
            providers: [...providers, MailerService, ...(options.extraProviders || [])],
        };
    }

    private static createAsyncProviders(options: MailerModuleOptions): Provider[] {
        const providers: Provider[] = [this.createAsyncOptionsProvider(options)];

        if (options.useClass) {
            providers.push({
                provide: options.useClass,
                useClass: options.useClass,
            });
        }

        return providers;
    }

    private static createAsyncOptionsProvider(options: MailerModuleOptions): Provider {
        if (options.useFactory) {
            return {
                name: MAILER_MODULE_OPTIONS,
                provide: MAILER_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
    }
}
