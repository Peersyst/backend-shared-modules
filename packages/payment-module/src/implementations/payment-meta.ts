import { StripeMeta } from "./stripe/stripe-meta";
import { PaypalMeta } from "./paypal/paypal-meta";

export type PaymentMeta = StripeMeta | PaypalMeta;
