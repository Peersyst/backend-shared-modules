import { Injectable } from "@nestjs/common";
import Stripe = require("stripe");
import { StripeMeta } from "./stripe-meta";
import { IPaymentService } from "../payment-wrapper.service";
import { PaymentDto } from "../../payment.dto";
import { Currency } from "../currency";
import { StripeOptions } from "./stripe-options";
import { PaymentStatus } from "../../entities/Payment";
import { PaymentBusinessException } from "../../exception/business.exception";
import { PaymentErrorCode } from "../../exception/error-codes";

@Injectable()
export class StripeService implements IPaymentService {
    private stripe: Stripe.Stripe;

    constructor(private readonly options: StripeOptions) {
        this.stripe = new Stripe.Stripe(options.privateKey, {
            apiVersion: "2020-08-27",
        });
    }
    async initiatePayment(payment: PaymentDto): Promise<PaymentDto> {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: payment.amount * 100,
            currency: payment.currency || Currency.Eur,
        });
        (payment.meta as StripeMeta) = {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
        };
        return payment;
    }

    async checkPaymentStatus(payment: PaymentDto): Promise<PaymentStatus> {
        if (!payment.meta || !(payment.meta as StripeMeta).paymentIntentId) {
            throw new PaymentBusinessException(PaymentErrorCode.UNINITIATED_PAYMENT);
        }
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve((payment.meta as StripeMeta).paymentIntentId);
            switch (paymentIntent.status) {
                case "canceled":
                    return PaymentStatus.Rejected;
                case "processing":
                case "requires_action":
                case "requires_capture":
                case "requires_confirmation":
                case "requires_payment_method":
                    return PaymentStatus.Pending;
                case "succeeded":
                    return PaymentStatus.Completed;
            }
        } catch (e) {
            return PaymentStatus.Pending;
        }
    }

    getPaymentData(payment: PaymentDto): StripeMeta {
        return payment.meta as StripeMeta;
    }
}
