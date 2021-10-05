import {
    MosaicId,
    MosaicInfo,
    NetworkConfiguration,
    NetworkType,
    RepositoryFactoryHttp,
    TransactionService
} from "symbol-sdk";
import {SymbolModuleOptions} from "./symbol.module";
import {Inject} from "@nestjs/common";
import {SYMBOL_MODULE_OPTIONS} from "./symbol.constants";

export class SymbolFactoryService {
    public readonly node: string;
    private readonly _networkType: NetworkType;
    private networkConfig: NetworkConfiguration;
    private _currencyMosaicInfo: MosaicInfo;

    constructor(
        @Inject(SYMBOL_MODULE_OPTIONS) private readonly options: SymbolModuleOptions,
    ) {
        this.node = options.node;
        this._networkType = options.networkType
        this.repositoryFactoryHttp.createNetworkRepository().getNetworkType().subscribe(networkType => {
            if (this._networkType !== networkType) {
                throw new Error("Network type on configuration doesn't match node's network");
            }
        });
        this.repositoryFactoryHttp.createNetworkRepository().getNetworkProperties().subscribe(props => {
            this.networkConfig = props;
            this.repositoryFactoryHttp.createMosaicRepository().getMosaic(this.currencyMosaicId).subscribe(mosaicInfo => {
                this._currencyMosaicInfo = mosaicInfo;
            })
        })
    }

    get repositoryFactoryHttp(): RepositoryFactoryHttp {
        return new RepositoryFactoryHttp(this.node);
    }

    get transactionService(): TransactionService {
        const receiptHttp = this.repositoryFactoryHttp.createReceiptRepository();
        const transactionHttp = this.repositoryFactoryHttp.createTransactionRepository();
        return new TransactionService(transactionHttp, receiptHttp);
    }

    get networkType(): NetworkType {
        return this._networkType;
    }

    get epochAdjustment(): number {
        return Number(this.networkConfig.network.epochAdjustment);
    }

    get generationHash(): string {
        return this.networkConfig.network.generationHashSeed;
    }

    get currencyMosaicId(): MosaicId {
        return new MosaicId(this.networkConfig.chain.currencyMosaicId
            .replace("0x", "")
            .replace(/'/g, "")
        );
    }

    get currencyMosaicDivisibility(): number {
        return this._currencyMosaicInfo.divisibility;
    }
}
