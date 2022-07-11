import { PaymentDto } from "../payment.dto";
import { PaymentStatus } from "../entities/Payment";
import { PaymentType } from "./payment-type";
import { Injectable } from "@nestjs/common";
import { PaypalService } from "./paypal/paypal.service";
import { StripeService } from "./stripe/stripe.service";
import { PaymentBusinessException } from "../exception/business.exception";
import { PaymentErrorCode } from "../exception/error-codes";
import { PaymentMeta } from "./payment-meta";

export interface IPaymentService {
    initiatePayment(payment: PaymentDto): Promise<PaymentDto>;
    checkPaymentStatus(payment: PaymentDto): Promise<PaymentStatus>
    getPaymentData(payment: PaymentDto): PaymentMeta
}

@Injectable()
export class PaymentWrapperService implements IPaymentService {
    constructor(
        private readonly paypalService: PaypalService,
        private readonly stripeService: StripeService,
    ) {}

    resolveService(paymentType: PaymentType): IPaymentService {
        switch (paymentType) {
            case PaymentType.Paypal:
                return this.paypalService;
            case PaymentType.Stripe:
                return this.stripeService;
            default:
                throw new PaymentBusinessException(PaymentErrorCode.PAYMENT_TYPE_NOT_IMPLEMENTED);
        }
    }

    checkPaymentStatus(payment: PaymentDto): Promise<PaymentStatus> {
        return this.resolveService(payment.type).checkPaymentStatus(payment);
    }

    initiatePayment(payment: PaymentDto): Promise<PaymentDto> {
        return this.resolveService(payment.type).initiatePayment(payment);
    }

    getPaymentData(payment: PaymentDto): PaymentMeta {
        return this.resolveService(payment.type).getPaymentData(payment);
    }

}
