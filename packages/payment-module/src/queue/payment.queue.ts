import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { PaymentService } from "../payment.service";
import { PaymentBusinessException } from "../exception/business.exception";
import { PaymentErrorCode } from "../exception/error-codes";
import { PaymentStatus } from "../entities/Payment";

export interface CheckPayment {
    paymentId: number;
}

@Processor("payment-queue")
export class PaymentConsumer {
    private readonly logger = new Logger(PaymentConsumer.name);

    constructor(private readonly paymentService: PaymentService) {}

    @Process("check-payment")
    async checkPayment(job: Job<CheckPayment>): Promise<void> {
        this.logger.log(`Processing Approve Transaction ${job.data.paymentId}`);
        try {
            const payment = await this.paymentService.getById(job.data.paymentId);
            if (!payment) {
                throw new PaymentBusinessException(PaymentErrorCode.PAYMENT_NOT_FOUND);
            }
            const paymentStatus = await this.paymentService.checkAndNotifyPayment(payment);
            if (paymentStatus === PaymentStatus.Completed) {
                this.logger.log(`payment ${payment.id} COMPLETED`);
                return;
            } else if (paymentStatus === PaymentStatus.Rejected) {
                this.logger.log(`payment ${payment.id} REJECTED`);
                return;
            } else {
                if (new Date(payment.createdAt).valueOf() > Date.now() - 1000 * 60 * 60 * 24) {
                    this.logger.log(`requeue payment ${payment.id}`);
                    await this.paymentService.sendPaymentToQueue(payment, 10000);
                }
                return;
            }
        } catch (e) {
            this.logger.error("Transaction in queue error: " + e.toString());
        }
    }
}
