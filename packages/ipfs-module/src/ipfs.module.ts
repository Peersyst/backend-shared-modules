import { DynamicModule, Module, Provider, Type, ForwardReference } from "@nestjs/common";
import { IpfsService } from "./ipfs.service";

@Module({})
export class XummModule {
    static register(ConfigModule: Type): DynamicModule {
        const providers: Provider[] = [IpfsService];
        const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
            ConfigModule,
        ];
        const exports: Provider[] = [IpfsService];

        return {
            module: XummModule,
            imports,
            providers,
            exports,
        };
    }
}


