import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { DataExportService } from "../../types/data-export.types";
import { ExportCSVOptions } from "./csv.types";
import { json2csv, Json2CsvOptions } from "json-2-csv";

@Injectable()
export class CSVService<T> implements DataExportService<T, void, ExportCSVOptions> {
    private formatData<T extends Record<string, any>>(data: T | T[], options?: Json2CsvOptions): string {
        return json2csv(data as object[], options);
    }

    public getHeaders<T>(object: T): string[] {
        return Object.keys(object);
    }

    public generate(data: T | T[], options: ExportCSVOptions = { fileName: "data" }): string {
        const element = Array.isArray(data) ? data[0] : data;
        const headers = this.getHeaders(element);
        return this.formatData(data, options.csvOptions);
    }

    public generateAndSend(res: Response, data: T | T[], options: ExportCSVOptions = { fileName: "data" }) {
        const csv = this.generate(data, options);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=${options.fileName}.csv`);
        res.send(csv);
    }
}
