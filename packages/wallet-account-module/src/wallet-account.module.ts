import { DynamicModule, ForwardReference, Module, Provider, Type } from "@nestjs/common";
import { WalletEvmsService } from "./services/wallet-evms.services";
import { CryptoModule } from "@peersyst/crypto-backend-module";
import { WalletAccount } from "./entities/WalletAccount";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WalletDto } from "./dto/wallet.dto";

export enum NetworksType {
    EVMS = "evms",
}

export interface WalletModuleOptions {
    networkType: NetworksType;
}

export interface WalletServiceInterface {
    createWallet(userId: number): Promise<any>;
    sign(userId: number, transaction: any): Promise<any>;
    getWallet(userId: number): Promise<WalletDto>;
}

@Module({})
export class WalletAccountModule {
    static register(ConfigModule: Type, ConfigService: any, options: WalletModuleOptions): DynamicModule {
        const providers: Provider[] = [];
        const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
            CryptoModule.registerAsync({
                useFactory: (config: typeof ConfigService) => ({
                    encryptionKey: config.get("server.encryptionKey"),
                }),
                inject: [ConfigService],
                imports: [ConfigModule],
            }),
            TypeOrmModule.forFeature([WalletAccount]),
        ];
        const exports: Provider[] = [];

        if (options.networkType === NetworksType.EVMS) {
            providers.push({ provide: "WalletService", useClass: WalletEvmsService });
            exports.push({ provide: "WalletService", useClass: WalletEvmsService });
        }

        return {
            module: WalletAccountModule,
            providers,
            exports,
            imports,
        };
    }
}
