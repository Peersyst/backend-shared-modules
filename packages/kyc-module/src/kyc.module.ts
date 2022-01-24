import { DynamicModule, Module, Provider, Type, ForwardReference } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DefaultNotificationService } from "./default-notification.service";
import { KycController } from "./kyc.controller";
import { KycService } from "./kyc.service";
import { KycSequelizeRepository } from "./sequelize/kyc-sequelize.repository";
import { KycModel } from "./sequelize/KycModel";
import { SumsubController } from "./sumsub.controller";
import { KycTypeormRepository } from "./typeorm/kyc-typeorm.repository";
import { KycEntity } from "./typeorm/KycEntity";


export enum OrmType {
    TYPEORM = "typeorm",
    SEQUELIZE = "sequelize",
}
export interface KycModuleOptions {
    ormType: OrmType;
    notifications?: boolean;
    NotificationService?: Type;
}

@Module({})
export class KycModule {
    static register(UserModule: Type, ConfigModule: Type, options: KycModuleOptions): DynamicModule {
        const providers: Provider[] = [KycService];
        const controllers: Type<any>[] = [SumsubController, KycController];
        const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
            ConfigModule,
            UserModule,            
        ];
        const exports: Provider[] = [KycService];

        if (options.notifications && !options.NotificationService) {
            throw new Error("Must indicate NotificationService when notifications = true");
        }
        if (options.notifications) {
            providers.push({ provide: "NotificationService", useClass: options.NotificationService });
        } else {
            providers.push({ provide: "NotificationService", useClass: DefaultNotificationService });
        }

        if (options.ormType === OrmType.SEQUELIZE) {
            providers.push({ provide: "KycRepository", useClass: KycSequelizeRepository });
            imports.push(SequelizeModule.forFeature([KycModel]));
        } else if (options.ormType === OrmType.TYPEORM) {
            providers.push({ provide: "KycRepository", useClass: KycTypeormRepository });
            imports.push(TypeOrmModule.forFeature([KycEntity]));
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

