import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { DataExportService } from "../../types/data-export.types";
import { ExportCSVOptions } from "./csv.types";

@Injectable()
export class CSVService<T> implements DataExportService<T, void, ExportCSVOptions> {
    private formatData<T extends Record<string, any>>(headers: string[], data: T | T[]): string {
        const header = headers.join(",");
        const rows = data.map((item: T) => Object.values(item).join(","));
        return [header, ...rows].join("\n");
    }

    public getHeaders<T>(object: T): string[] {
        return Object.keys(object);
    }

    public generate(data: T | T[]): string {
        const element = Array.isArray(data) ? data[0] : data;
        const headers = this.getHeaders(element);
        return this.formatData(headers, data);
    }

    public generateAndSend(res: Response, data: T | T[], options: ExportCSVOptions = { fileName: "data" }) {
        const csv = this.generate(data);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=${options.fileName}.csv`);
        res.send(csv);
    }
}
