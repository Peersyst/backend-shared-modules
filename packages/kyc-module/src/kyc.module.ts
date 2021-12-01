import { DynamicModule, Module, Provider, Type, ForwardReference } from "@nestjs/common";
import { KycService } from "./kyc.service";

export interface AuthModuleOptions {}

@Module({})
export class AuthModule {
    static register(UserModule: Type, ConfigModule: Type, ConfigService: any, options?: AuthModuleOptions): DynamicModule {
        const providers: Provider[] = [KycService];
        const controllers: Type<any>[] = [];
        const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
            ConfigModule,
            UserModule,            
        ];
        const exports: Provider[] = [KycService];

        return {
            module: AuthModule,
            imports,
            providers,
            controllers,
            exports,
        };
    }
}


