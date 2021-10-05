import {DynamicModule, Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';
import {BlockchainAccountModel} from "./blockchain-account.model";
import {BlockchainAccountService} from "./blockchain-account.service";
import {CryptoModule} from "@peersyst/crypto-backend-module";
import {SymbolModule} from "@peersyst/symbol-backend-module";

@Module({})
export class BlockchainAccountModule {
    static register(customBlockchainAccountModel?: any): DynamicModule {
        return {
            module: BlockchainAccountModule,
            imports: [
                SequelizeModule.forFeature([customBlockchainAccountModel || BlockchainAccountModel]),
                CryptoModule,
                SymbolModule,
            ],
            providers: [
                BlockchainAccountService,
            ],
            exports: [
                BlockchainAccountService,
            ],
        };
    }
}
