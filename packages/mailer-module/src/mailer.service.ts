import { Inject, Injectable } from "@nestjs/common";
import { Transporter, createTransport } from "nodemailer";
import { EnhancedSendMailOptions } from "./common/types/mailer.types";
import { ICompiler } from "./compilers/compiler.types";
import { MAILER_MODULE_OPTIONS } from "./common/constants/mailer-options";
import { MailerModuleOptions } from "./common/types/mailer-options.types";
import { HandlebarsCompiler } from "./compilers/handlebars.compiler";

@Injectable()
export class MailerService {
    private transporter: Transporter;
    private compiler: ICompiler;

    constructor(@Inject(MAILER_MODULE_OPTIONS) private readonly options: MailerModuleOptions) {
        this.transporter = createTransport(options.transport, options.defaults);
        if (!options.template) return;
        const { compiler, templatePath } = options.template;
        switch (compiler) {
            case "handlebars":
                this.compiler = new HandlebarsCompiler(templatePath);
                break;
            default:
                this.compiler = new HandlebarsCompiler(templatePath);
        }
    }

    public async sendMail({ template, context, ...options }: EnhancedSendMailOptions) {
        options.html = await this.compiler.compileTemplate({ templateName: template, data: context });

        return await this.transporter.sendMail(options);
    }
}
