import { Injectable } from "@nestjs/common";
import { PaymentBusinessException } from "../../exception/business.exception";
import { PaymentDto } from "../../payment.dto";
import { PaymentStatus } from "../../entities/Payment";
import { PaypalMeta } from "./paypal-meta";
import { IPaymentService } from "../payment-wrapper.service";
import { PaypalOptions } from "./paypal-options";
import axios from "axios";
import { PaymentErrorCode } from "../../exception/error-codes";

@Injectable()
export class PaypalService implements IPaymentService {
    constructor(private readonly options: PaypalOptions) {}

    private static async postRequest(url: string, body?: any, headers?: { [key: string]: string }): Promise<any> {
        try {
            return await axios.post(url, body, {
                headers,
            });
        } catch (err) {
            console.error(err.toString());
        }
    };

    private async getAccessToken(): Promise<string> {
        const authString = Buffer.from(`${this.options.clientId}:${this.options.secret}`).toString("base64");

        const res = await PaypalService.postRequest(this.options.oauthApi, "grant_type=client_credentials", {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${authString}`,
        });
        return res.data.access_token;
    }

    async initiatePayment(payment: PaymentDto): Promise<PaymentDto> {
        const accessToken = await this.getAccessToken();
        const data = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "EUR",
                        value: payment.amount.toFixed(2),
                    },
                },
            ],
        };

        // Create order
        const res = await PaypalService.postRequest(this.options.orderApi, data, {
            Authorization: `Bearer ${accessToken}`,
        });
        (payment.meta as PaypalMeta) = {
            orderId: res.data.id,
        };
        return payment;
    }

    async checkPaymentStatus(payment: PaymentDto): Promise<PaymentStatus> {
        if (!payment.meta || !(payment.meta as PaypalMeta).orderId) {
            throw new PaymentBusinessException(PaymentErrorCode.UNINITIATED_PAYMENT);
        }

        const accessToken = await this.getAccessToken();
        const orderId = (payment.meta as PaypalMeta).orderId;

        try {
            const res = await PaypalService.postRequest(
                `${this.options.orderApi}${orderId}/capture`,
                {},
                {
                    Authorization: `Bearer ${accessToken}`,
                },
            );

            if (res) {
                switch (res.data.status) {
                    case "CREATED":
                    case "SAVED":
                    case "APPROVED":
                    case "PAYER_ACTION_REQUIRED":
                        return PaymentStatus.Pending;
                    case "VOIDED":
                        return PaymentStatus.Rejected;
                    case "COMPLETED":
                        return PaymentStatus.Completed;
                    default:
                        return PaymentStatus.Pending;
                }
            } else {
                return PaymentStatus.Pending;
            }
        } catch (e) {
            return PaymentStatus.Pending;
        }
    }

    getPaymentData(payment: PaymentDto): PaypalMeta {
        return payment.meta as PaypalMeta;
    }
}
