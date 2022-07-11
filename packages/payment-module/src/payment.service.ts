import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { PaymentDto } from "./payment.dto";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { PaymentWrapperService } from "./implementations/payment-wrapper.service";
import { Payment, PaymentStatus } from "./entities/Payment";
import { PaymentType } from "./implementations/payment-type";
import { Currency } from "./implementations/currency";
import { PaymentBusinessException } from "./exception/business.exception";
import { PaymentErrorCode } from "./exception/error-codes";

export interface IPaymentCallbacks {
    onPaymentConfirmed(paymentDto: PaymentDto): void;
}

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
        private readonly paymentWrapperService: PaymentWrapperService,
        @InjectQueue("payment-queue") private readonly queue: Queue,
        @Inject("PaymentCallbacks")
        private readonly paymentCallbacks?: IPaymentCallbacks,
    ) {}

    async create(userId: number, amount: number, currency: Currency, type: PaymentType, reference?: string): Promise<PaymentDto> {
        const payment = await this.paymentRepository.save({
            userId: userId,
            type,
            amount,
            currency,
            status: PaymentStatus.Pending,
            reference,
        });
        const paymentWithMeta = await this.paymentWrapperService.initiatePayment(PaymentDto.fromEntity(payment));
        await this.paymentRepository.update(payment.id, { meta: JSON.stringify(paymentWithMeta.meta) });
        await this.sendPaymentToQueue(paymentWithMeta, 5000);
        return paymentWithMeta;
    }

    async getById(id: number): Promise<PaymentDto> {
        const payment = await this.paymentRepository.findOne({ where: { id } });
        if (!payment) {
            throw new PaymentBusinessException(PaymentErrorCode.PAYMENT_NOT_FOUND);
        }
        return PaymentDto.fromEntity(payment);
    }

    async getPaymentsByUser(userId: number): Promise<PaymentDto[]> {
        const payments = await this.paymentRepository.find({ where: { userId } });
        return payments.map(PaymentDto.fromEntity);
    }

    async checkAndNotifyPayment(payment: PaymentDto): Promise<PaymentStatus> {
        const status = await this.paymentWrapperService.checkPaymentStatus(payment);
        await this.paymentRepository.update(payment.id, { status });
        if (payment.status !== status && status === PaymentStatus.Completed) {
            payment.status = status;
            await this.paymentCallbacks?.onPaymentConfirmed(payment);
        }
        return status;
    }

    async sendPaymentToQueue(payment: PaymentDto, delay: number): Promise<void> {
        await this.queue.add("check-payment", { paymentId: payment.id }, { delay });
    }
}
