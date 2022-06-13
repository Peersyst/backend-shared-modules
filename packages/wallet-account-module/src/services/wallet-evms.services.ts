import { ethers } from "ethers";
import { WalletServiceInterface } from "../wallet-account.module";
import { CryptoService, Encrypted } from "@peersyst/crypto-backend-module";
import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WalletAccount } from "../entities/WalletAccount";
import { ConfigService } from "@nestjs/config";
import { BusinessException } from "../exception/business.exception";
import { WalletErrorCode } from "../exception/error-codes";
import { WalletDto } from "../dto/wallet.dto";

export class WalletEvmsService implements WalletServiceInterface {
    constructor(
        @Inject(ConfigService) private readonly configService: ConfigService,
        @Inject(CryptoService) private readonly cryptoService: CryptoService,
        @InjectRepository(WalletAccount) private readonly walletAccountRepository: Repository<WalletAccount>,
    ) {}

    async sign(userId: number, transaction: ethers.providers.TransactionRequest): Promise<string> {
        const walletEntity = await this.walletAccountRepository.findOne({ where: { userId } });
        const privateKey = this.cryptoService.decrypt(Encrypted.deserialize(walletEntity.encryptedPrivateKey));
        const provider = new ethers.providers.JsonRpcProvider(this.configService.get("wallet.node"));
        const wallet = new ethers.Wallet(String(privateKey), provider);
        let sign = await wallet.signTransaction(transaction);
        return sign;
    }

    async createWallet(userId: number): Promise<string> {
        const walletEntity = await this.walletAccountRepository.findOne({ where: { userId } });
        let address = "";
        if (!walletEntity) {
            const wallet = await ethers.Wallet.createRandom();
            await this.walletAccountRepository.save({
                userId,
                address: wallet.address,
                encryptedPrivateKey: this.cryptoService.encrypt(wallet.privateKey).serialize(),
            });
            address = wallet.address;
        } else {
            throw new BusinessException(WalletErrorCode.USER_HAVE_WALLET);
        }
        return address;
    }

    async getWallet(userId: number): Promise<WalletDto> {
        const walletEntity = await this.walletAccountRepository.findOne({ where: { userId } });
        if (!walletEntity) {
            throw new BusinessException(WalletErrorCode.USER_DONT_HAVE_WALLET);
        }
        return { address: walletEntity.address };
    }
}
