import { ApiProperty } from "@nestjs/swagger";
import { PaymentType } from "./implementations/payment-type";
import { Currency } from "./implementations/currency";

export class CreatePaymentRequest {
    @ApiProperty({
        type: "number",
        required: true,
    })
    amount: number;

    @ApiProperty({
        enum: Currency,
        required: true,
    })
    currency: Currency;

    @ApiProperty({
        enum: PaymentType,
        required: true,
    })
    type: PaymentType;
}
