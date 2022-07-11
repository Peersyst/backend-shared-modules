import { Payment, PaymentStatus } from "./entities/Payment";
import { PaymentMeta } from "./implementations/payment-meta";
import { PaymentType } from "./implementations/payment-type";
import { Currency } from "./implementations/currency";

export class PaymentDto {
    id: number;
    userId: number;
    type: PaymentType;
    amount: number;
    currency?: Currency;
    status: PaymentStatus;
    reference?: string;
    meta?: PaymentMeta;
    createdAt?: Date;

    static fromEntity(payment: Payment): PaymentDto {
        return {
            id: payment.id,
            userId: payment.userId,
            type: payment.type,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            reference: payment.reference,
            meta: JSON.parse(payment.meta),
            createdAt: payment.createdAt,
        };
    }
}
