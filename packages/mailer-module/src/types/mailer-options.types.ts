import SMTPTransport from "nodemailer/lib/smtp-transport";
import { CompilerParams } from "../compilers/compiler.types";
import { ModuleMetadata, Provider, Type } from "@nestjs/common";

export interface MailerOptions {
    transport?: SMTPTransport | SMTPTransport.Options | string;
    defaults?: SMTPTransport.Options;
    template?: CompilerParams;
}

export interface MailerModuleOptions extends Pick<ModuleMetadata, "imports"> {
    inject?: any[];
    useClass?: Type<MailerOptions>;
    useFactory?: (...args: any[]) => Promise<MailerOptions> | MailerOptions;
    extraProviders?: Provider[];
}
