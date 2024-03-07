import { DynamicModule, Module, Provider, Type, ForwardReference } from "@nestjs/common";
import { KycTestController } from "./kyc-test.controller";
import { KycController } from "./kyc.controller";
import { KycService } from "./kyc.service";
import { SumsubController } from "./sumsub.controller";
import { SumsubService } from "./sumsub.service";
import { KycTypeormRepository } from "./typeorm/kyc-typeorm.repository";
import { KycEntity } from "./typeorm/KycEntity";
import { ConfigService } from "@nestjs/config";

export interface KycModuleOptions {
    addTestEndpoints: boolean;
}

@Module({})
export class KycModule {
    static register(UserModule:Type,ConfigModule: Type, TypeOrmModule:any,  options: KycModuleOptions): DynamicModule {
        const providers: Provider[] = [ConfigService,KycService, SumsubService];
        const controllers: Type<any>[] = [SumsubController, KycController];
        const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
            ConfigModule, 
            UserModule   
        ];
        const exports: Provider[] = [KycService, SumsubService];
        providers.push({ provide: "KycRepository", useClass: KycTypeormRepository });
        imports.push(TypeOrmModule.forFeature([KycEntity]));
        exports.push(TypeOrmModule);
        

        if (options.addTestEndpoints) {
            controllers.push(KycTestController);
        }

        return {
            module: KycModule,
            imports,
            providers,
            controllers,
            exports,
        };
    }
}


