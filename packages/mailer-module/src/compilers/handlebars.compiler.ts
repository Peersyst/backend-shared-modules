import { ICompiler, CompileOptions } from "./compiler.types";
import { compile } from "handlebars";
import { Injectable } from "@nestjs/common";
import * as fs from "fs";

@Injectable()
export class HandlebarsCompiler implements ICompiler {
    // TODO: Inject MailerModuleOptions["handlebarsOptions"]
    constructor() {}

    public async compileTemplate({ templateName, data }: CompileOptions): Promise<string> {
        const templateContent = fs.readFileSync(process.cwd() + "TEMPLATE_DIRECTORY" + `${templateName}.hbs`).toString();
        const hbTemplate = compile(templateContent);

        return hbTemplate(data ?? {});
    }
}
