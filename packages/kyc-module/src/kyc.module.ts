import { DynamicModule, Module, Provider, Type, ForwardReference } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DefaultNotificationService } from "./default-notification.service";
import { KycTestController } from "./kyc-test.controller";
import { KycController } from "./kyc.controller";
import { KycService } from "./kyc.service";
import { KycSequelizeRepository } from "./sequelize/kyc-sequelize.repository";
import { KycModel } from "./sequelize/KycModel";
import { SumsubController } from "./sumsub.controller";
import { SumsubService } from "./sumsub.service";
import { KycTypeormRepository } from "./typeorm/kyc-typeorm.repository";
import { KycEntity } from "./typeorm/KycEntity";


export enum OrmType {
    TYPEORM = "typeorm",
    SEQUELIZE = "sequelize",
}
export interface KycModuleOptions {
    ormType: OrmType;
    addTestEndpoints: boolean;
    notifications?: boolean;
    NotificationService?: Type;
}

@Module({})
export class KycModule {
    static register(UserModule: Type, ConfigModule: Type, options: KycModuleOptions, UserService?: Type): DynamicModule {
        const providers: Provider[] = [KycService, SumsubService];
        const controllers: Type<any>[] = [SumsubController, KycController];
        const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
            ConfigModule,
            UserModule,            
        ];
        const exports: Provider[] = [KycService, SumsubService];

        if (options.notifications && !options.NotificationService) {
            throw new Error("Must indicate NotificationService when notifications = true");
        }
        if (options.notifications) {
            providers.push({ provide: "NotificationService", useClass: options.NotificationService });
        } else {
            providers.push({ provide: "NotificationService", useClass: DefaultNotificationService });
        }

        if (UserService) {
            providers.push({ provide: "UserService", useClass: UserService });
        }

        if (options.ormType === OrmType.SEQUELIZE) {
            providers.push({ provide: "KycRepository", useClass: KycSequelizeRepository });
            imports.push(SequelizeModule.forFeature([KycModel]));
        } else if (options.ormType === OrmType.TYPEORM) {
            providers.push({ provide: "KycRepository", useClass: KycTypeormRepository });
            imports.push(TypeOrmModule.forFeature([KycEntity]));
            exports.push(TypeOrmModule);
        }

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


