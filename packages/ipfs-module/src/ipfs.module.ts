import { DynamicModule, Module, Provider, Type, ForwardReference } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { XummService } from "./xumm.service";
import { XummTypeormRepository } from "./typeorm/xumm-typeorm.repository";
import { XummEntity } from "./typeorm/XummEntity";

@Module({})
export class XummModule {
    static register(ConfigModule: Type): DynamicModule {
        const providers: Provider[] = [XummService, { provide: "XummRepository", useClass: XummTypeormRepository }];
        const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
            ConfigModule,
            TypeOrmModule.forFeature([XummEntity]),
        ];
        const exports: Provider[] = [XummService];

        return {
            module: XummModule,
            imports,
            providers,
            exports,
        };
    }
}


