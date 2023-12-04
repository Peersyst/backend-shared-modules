import SMTPTransport from "nodemailer/lib/smtp-transport";
import { CompilerParams } from "../../compilers/compiler.types";

export interface MailerModuleOptions {
    transport?: SMTPTransport | SMTPTransport.Options | string;
    defaults?: SMTPTransport.Options;
    template?: CompilerParams;
}
