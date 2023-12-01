import { Injectable } from "@nestjs/common";
import { Transporter } from "nodemailer";
import { EnhancedSendMailOptions } from "./types/mailer.types";
import { compile } from "handlebars";
import * as fs from "fs";
import { ICompiler } from "./compilers/compiler.types";

@Injectable()
export class MailerService {
    private transporter: Transporter;
    private compiler: ICompiler;

    // TODO: Add MailerModuleOptions to init transporter
    constructor() {}

    public async sendMail({ template, context, ...options }: EnhancedSendMailOptions) {
        const templateContent = fs.readFileSync(process.cwd() + "TEMPLATE_DIRECTORY" + `${template}.hbs`).toString();
        const hbTemplate = compile(templateContent);
        options.html = hbTemplate(context);

        return await this.transporter.sendMail(options);
    }
}
