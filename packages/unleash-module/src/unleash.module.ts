import { DynamicModule, Module, Provider, Type, ForwardReference } from "@nestjs/common";
import { UnleashService } from "./unleash.service";

@Module({})
export class UnleashModule {
    static register(ConfigModule: Type): DynamicModule {
        const providers: Provider[] = [UnleashService];
        const controllers: Type<any>[] = [];
        const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
            ConfigModule,            
        ];
        const exports: Provider[] = [UnleashService];

        return {
            module: UnleashModule,
            imports,
            providers,
            controllers,
            exports,
        };
    }
}


