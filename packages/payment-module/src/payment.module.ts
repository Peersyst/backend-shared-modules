import { DynamicModule, Global, Module, ModuleMetadata, Provider, Type } from "@nestjs/common";
import { PaypalOptions } from "./implementations/paypal/paypal-options";
import { StripeOptions } from "./implementations/stripe/stripe-options";
import { PaypalService } from "./implementations/paypal/paypal.service";
import { StripeService } from "./implementations/stripe/stripe.service";
import { IPaymentCallbacks, PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { Payment } from "./entities/Payment";
import { PaymentConsumer } from "./queue/payment.queue";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bull";

const PAYMENT_MODULE_ID = "PaymentModuleId";
const PAYMENT_MODULE_OPTIONS = "PaymentModuleOptionsId"

export interface PaymentModuleOptions {
    paypal?: PaypalOptions;
    stripe?: StripeOptions;
    paymentCallbacks: IPaymentCallbacks;
}

export interface PaymentModuleOptionsFactory {
    createConfigModuleOptions(): Promise<PaymentModuleOptions> | PaymentModuleOptions;
}

export interface PaymentModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    useExisting?: Type<PaymentModuleOptionsFactory>;
    useClass?: Type<PaymentModuleOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<PaymentModuleOptions> | PaymentModuleOptions;
    inject?: any[];
}

export function createPaymentOptionsProvider(options: PaymentModuleOptions): Provider[] {
    const providers: Provider[] = [{ provide: PAYMENT_MODULE_ID, useValue: options || {} }, PaymentConsumer];
    if (options.paypal) {
        providers.push({ provide: PaypalService, useValue: new PaypalService(options.paypal) });
    }
    if (options.stripe) {
        providers.push({ provide: StripeService, useValue: new StripeService(options.stripe) });
    }
    if (options.paymentCallbacks) {
        providers.push({ provide: "PaymentCallbacks", useValue: options.paymentCallbacks });
    }
    return providers;
}

const PaymentModuleProviders: Provider[] = [PaymentService];

@Global()
@Module({})
export class PaymentModule {
    static register(options: PaymentModuleOptions): DynamicModule {
        return {
            module: PaymentModule,
            global: true,
            imports: [
                TypeOrmModule.forFeature([Payment]),
                BullModule.registerQueue({
                    name: "payment-queue",
                }),
            ],
            providers: [
                ...createPaymentOptionsProvider(options),
                ...PaymentModuleProviders,
            ],
            controllers: [PaymentController],
            exports: PaymentModuleProviders,
        };
    }

    static registerAsync(options: PaymentModuleAsyncOptions): DynamicModule {
        return {
            module: PaymentModule,
            global: true,
            imports: options.imports || [],
            providers: [
                ...this.createAsyncProviders(options),
                ...PaymentModuleProviders,
            ],
            controllers: [PaymentController],
            exports: PaymentModuleProviders,
        };
    }

    private static createAsyncProviders(
        options: PaymentModuleAsyncOptions
    ): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass
            }
        ];
    }

    private static createAsyncOptionsProvider(
        options: PaymentModuleAsyncOptions
    ): Provider {
        if (options.useFactory) {
            return {
                provide: PAYMENT_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: PAYMENT_MODULE_OPTIONS,
            useFactory: async (optionsFactory: PaymentModuleOptionsFactory) =>
                await optionsFactory.createConfigModuleOptions(),
            inject: [options.useExisting || options.useClass]
        };
    }
}
