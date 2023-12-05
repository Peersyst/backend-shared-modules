import { PDFOptions, Puppeteer, PuppeteerLaunchOptions } from "puppeteer";

export interface ExportPDFOptions extends Omit<PDFOptions, "path"> {
    templateName: string;
    fileName: string;
}

export interface ModulePDFOptions {
    templateDir: string;
    exportDir: string;
    temporary?: boolean;
    puppeteer?: PuppeteerLaunchOptions;
}
