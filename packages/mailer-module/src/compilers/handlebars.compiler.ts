import { ICompiler, CompileOptions } from "./compiler.types";
import { compile } from "handlebars";
import { Injectable } from "@nestjs/common";
import * as fs from "fs";

export class HandlebarsCompiler implements ICompiler {
    constructor(private readonly templatePath: string) {}

    public async compileTemplate({ templateName, data }: CompileOptions): Promise<string> {
        const templateContent = fs.readFileSync(this.templatePath + `${templateName}.hbs`).toString();
        const hbTemplate = compile(templateContent);

        return hbTemplate(data ?? {});
    }
}
