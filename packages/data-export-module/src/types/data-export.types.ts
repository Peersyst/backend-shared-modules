import { Response } from "express";
import { ExportPDFOptions, ModulePDFOptions } from "../modules/pdf/pdf.types";
import { ExportCSVOptions } from "../modules/csv/csv.types";

/* Variables */
export type DataExportInput = Record<string, any>[];
export type DataExportFormat = "csv" | "pdf";

export type GenerateOptions = ExportPDFOptions | ExportCSVOptions;

/* Services */
export interface DataExportService<TParams = DataExportInput, TData = any> {
    generate(data: TParams[], options?: GenerateOptions): TData;
    generateAndSend(res: Response, data: TParams[], options?: GenerateOptions): void;
}

export interface DataExportAsyncService<TParams = DataExportInput, TData = any> {
    generateAsync(data: TParams[], options?: GenerateOptions): Promise<TData>;
    generateAsyncAndSend(res: Response, data: TParams[], options?: GenerateOptions): Promise<void>;
}

export interface DataExportModuleOptions {
    pdf: ModulePDFOptions;
}
