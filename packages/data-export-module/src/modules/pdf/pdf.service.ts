import { Inject, Injectable } from "@nestjs/common";
import { Response } from "express";
import { DataExportAsyncService } from "../../types/data-export.types";
import puppeteer from "puppeteer";
import { ExportPDFOptions, ModulePDFOptions } from "./pdf.types";
import * as fs from "fs";
import * as path from "path";
import handlebars from "handlebars";
import { DATA_EXPORT_PDF_OPTIONS, PUPPETEER_ARGS } from "../../constants/pdf.constants";

@Injectable()
export class PDFService<TParams> implements DataExportAsyncService<TParams, void> {
    constructor(@Inject(DATA_EXPORT_PDF_OPTIONS) private readonly pdfOptions: ModulePDFOptions) {}

    public async generateAsync(data: TParams | TParams[], options: ExportPDFOptions) {
        const { exportDir, templateDir, puppeteer: puppeteerOptions } = this.pdfOptions;

        const { fileName, templateName, ...restOptions } = options;

        /* Set puppeteer launch options */
        const browser = await puppeteer.launch(
            puppeteerOptions || {
                headless: "new",
                defaultViewport: {
                    width: 595,
                    height: 842,
                    deviceScaleFactor: 1,
                },
                args: PUPPETEER_ARGS,
            },
        );
        const page = await browser.newPage();

        /* Load template */

        const templateHtml = fs.readFileSync(path.join(templateDir, templateName), "utf8");
        const template = handlebars.compile(templateHtml);

        const html = template(data);

        await page.setContent(html);
        await page.evaluateHandle("document.fonts.ready");
        await page.emulateMediaType("screen");

        const filePath = path.join(exportDir, `${fileName}.pdf`);

        /* Generate PDF */
        await page.pdf({ ...restOptions, path: filePath });
        await browser.close();

        return;
    }

    public async generateAsyncAndSend(res: Response, data: TParams | TParams[], options: ExportPDFOptions) {
        const { exportDir, temporary } = this.pdfOptions;

        await this.generateAsync(data, options);

        const filePath = path.join(exportDir, `${options.fileName}.pdf`);

        const stat = fs.statSync(filePath);

        res.setHeader("Content-Length", stat.size);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${options.fileName}.pdf`);

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);

        // Delete file
        if (temporary) {
            fs.unlink(filePath, () => undefined);
        }
    }
}
