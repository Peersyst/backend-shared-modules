import { Body, Controller, Get, Post, Query, Request } from "@nestjs/common";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PaymentService } from "./payment.service";
import { PaymentDto } from "./payment.dto";
import { ApiErrorDecorators } from "./exception/error-response.decorator";
import { PaymentBusinessException } from "./exception/business.exception";
import { PaymentErrorCode } from "./exception/error-codes";
import { Authenticated } from "@peersyst/auth-module";
import { CreatePaymentRequest } from "./create-payment.request";
import { PaymentStatus } from "./entities/Payment";

@ApiTags("payment")
@Controller("payment")
@ApiErrorDecorators()
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
    ) {}

    @Post("create")
    @ApiOperation({ summary: "Start a payment and get details" })
    @Authenticated()
    @ApiException(() => new PaymentBusinessException(PaymentErrorCode.PAYMENT_TYPE_NOT_IMPLEMENTED))
    @ApiOkResponse({ type: PaymentDto })
    async registerPayment(@Body() request: CreatePaymentRequest, @Request() req): Promise<PaymentDto> {
        return this.paymentService.create(req.user.id, request.amount, request.currency, request.type);
    }

    @Get(":id/status")
    @ApiOperation({ summary: "Check transaction status" })
    @Authenticated()
    @ApiException(() => new PaymentBusinessException(PaymentErrorCode.PAYMENT_TYPE_NOT_IMPLEMENTED))
    @ApiException(() => new PaymentBusinessException(PaymentErrorCode.PAYMENT_NOT_FOUND))
    async checkStatus(@Query("id") id: number): Promise<{ paymentStatus: PaymentStatus }> {
        return {
            paymentStatus: (await this.paymentService.getById(Number(id))).status,
        };
    }

    @Get("all")
    @ApiOperation({ summary: "Get payments from user" })
    @Authenticated()
    @ApiException(() => new PaymentBusinessException(PaymentErrorCode.PAYMENT_TYPE_NOT_IMPLEMENTED))
    @ApiException(() => new PaymentBusinessException(PaymentErrorCode.PAYMENT_NOT_FOUND))
    async getPayments(@Request() req): Promise<PaymentDto[]> {
        return this.paymentService.getPaymentsByUser(req.user.id);
    }
}
