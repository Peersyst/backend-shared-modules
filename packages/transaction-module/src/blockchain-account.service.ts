import {BlockchainAccountEntity} from "./blockchain-account.entity";
import {InjectModel} from "@nestjs/sequelize";
import {BlockchainAccountModel} from "./blockchain-account.model";
import {Account} from "symbol-sdk";
import {SymbolFactoryService} from "@peersyst/symbol-backend-module";
import {CryptoService, Encrypted} from "@peersyst/crypto-backend-module";

export class BlockchainAccountService {
    constructor(
        @InjectModel(BlockchainAccountModel)
        private readonly model: typeof BlockchainAccountModel,
        private readonly symbolFactory: SymbolFactoryService,
        private readonly cryptoService: CryptoService,
    ) {}

    async findById(id: number): Promise<BlockchainAccountEntity | null> {
        const model = await this.model.findByPk(id);
        return model ? this.modelToEntity(model): null;
    }

    async findByUserId(userId: number): Promise<BlockchainAccountEntity | null> {
        const model = await this.model.findOne({
            where: { userId }
        });
        return model ? this.modelToEntity(model): null;
    }

    async findByAddress(address: string): Promise<BlockchainAccountEntity | null> {
        const model = await this.model.findOne({
            where: { address }
        });
        return model ? this.modelToEntity(model): null;
    }

    async generateNew(userId: number): Promise<BlockchainAccountEntity> {
        const account = Account.generateNewAccount(this.symbolFactory.networkType);
        const model = await this.model.create({
            userId,
            address: account.address.plain(),
            publicKey: account.publicKey,
            encryptedPrivateKey: this.cryptoService.encrypt(account.privateKey).serialize(),
        });
        return this.modelToEntity(model);
    }

    modelToEntity(model: BlockchainAccountModel): BlockchainAccountEntity {
        return {
            id: model.id,
            userId: model.userId,
            address: model.address,
            publicKey: model.publicKey,
            privateKey: this.cryptoService.decrypt(Encrypted.deserialize<string>(model.encryptedPrivateKey)),
        };
    }
}
