import {DynamicModule, Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';
import {BlockchainAccountModel} from "./blockchain-account.model";
import {BlockchainAccountService} from "./blockchain-account.service";
import {CryptoModule} from "../crypto/crypto.module";
import {SymbolModule} from "../symbol/symbol.module";

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