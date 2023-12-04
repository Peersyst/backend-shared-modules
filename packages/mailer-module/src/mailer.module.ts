import { DynamicModule, Module, Provider, Type } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { MAILER_MODULE_OPTIONS } from "./common/constants/mailer-options";
import { MailerModuleOptions } from "./common/types/mailer-options.types";

@Module({})
export class MailerModule {
    static forRootAsync(options: MailerModuleOptions): DynamicModule {
        const exports: Provider[] = [];
        const imports = [];
        const providers: Provider[] = [
            {
                provide: MAILER_MODULE_OPTIONS,
                useValue: options,
            },
            MailerService,
        ];

        return {
            module: MailerModule,
            global: true,
            imports,
            exports,
            providers,
        };
    }
}
