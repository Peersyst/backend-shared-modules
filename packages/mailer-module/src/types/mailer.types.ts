import { SendMailOptions } from "nodemailer";

export interface EnhancedSendMailOptions extends SendMailOptions {
    template?: string;
    context?: {
        [name: string]: any;
    };
}
