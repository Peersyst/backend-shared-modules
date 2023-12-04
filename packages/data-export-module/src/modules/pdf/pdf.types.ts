import { PDFOptions } from "puppeteer";

export interface ExportPDFOptions extends Omit<PDFOptions, "path"> {
    templatePath: string;
    exportPath: string;
    temporary?: boolean;
    fileName: string;
}
