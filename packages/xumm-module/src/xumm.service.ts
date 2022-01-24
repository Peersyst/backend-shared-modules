import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { XummSdk } from "xumm-sdk";
import { XummPostPayloadResponse } from "xumm-sdk/dist/src/types";
import { XummI } from "./dto/xumm.dto";
import { XummBusinessException } from "./exception/business.exception";
import { XummErrorCode } from "./exception/error-codes";
import { verifySignature } from "verify-xrpl-signature";

export interface XummRepositoryInterface {
    create: (userToken: string, address: string, payloadId?: string) => Promise<XummI>;
    findByAddress: (address: string) => Promise<XummI>;
}

@Injectable()
export class XummService {
    private readonly appKey: string;
    private readonly appSecret: string;
    private readonly xummSdk: XummSdk;

    constructor(
        @Inject(ConfigService) private configService: ConfigService,
        @Inject("XummRepository") private readonly xummRepository: XummRepositoryInterface,
    ) {
        this.appKey = this.configService.get("xumm.appKey");
        this.appSecret = this.configService.get("xumm.appSecret");
        this.xummSdk = new XummSdk(this.appKey, this.appSecret);
    }

    async signIn(address: string): Promise<XummPostPayloadResponse> {
        const subscription = await this.xummSdk.payload.createAndSubscribe(
            {
                txjson: {
                  TransactionType : 'SignIn',
                },
            }, async (event) => {
                // console.log(`Payload ${event.uuid} data:`, event.data);
                if (event.data.signed !== undefined) {
                    const signedPayload = await this.xummSdk.payload.get(subscription.created.uuid);
                    const userToken = signedPayload?.application.issued_user_token;
                    const address = signedPayload?.response.account;
                    const verifyResult = verifySignature(signedPayload.response.hex);

                    if (signedPayload.meta.signed !== true) {
                        event.resolve("is not signed");
                    } else if (signedPayload.response.account !== address) {
                        event.resolve("wrong address");
                    } else if (verifyResult.signatureValid !== true || verifyResult.signedBy !== address) {
                        event.resolve("wrong signature");
                    } else {
                        await this.xummRepository.create(userToken, address, subscription.created.uuid);
                        event.resolve("is signed");
                    }
                }
            }
        )
    
        return subscription.created;
    }

    async transactionRequest(sender: string, receiver: string, amount: string): Promise<XummPostPayloadResponse> {
        const xummEntity = await this.xummRepository.findByAddress(sender);
        if (!xummEntity) {
            throw new XummBusinessException(XummErrorCode.USER_NOT_SIGNED_IN);
        }
        return await this.xummSdk.payload.create(
            {
                txjson: {
                    TransactionType : 'Payment',
                    Destination : receiver,
                    Amount: amount,
                },
                user_token: xummEntity.userToken,
            },
        );
    }
}
