import { Response } from "express";
import { ModulePDFOptions } from "../modules/pdf/pdf.types";

/* Variables */
export type DataExportInput = Record<string, any>[];
export type GenerateOptions = Record<string, any>[];

/* Services */
export interface DataExportService<TParams = DataExportInput, TData = any, TOptions = GenerateOptions> {
    generate(data: TParams[], options?: TOptions): TData;
    generateAndSend(res: Response, data: TParams[], options?: TOptions): void;
}

export interface DataExportAsyncService<TParams = DataExportInput, TData = any, TOptions = GenerateOptions> {
    generateAsync(data: TParams[], options?: TOptions): Promise<TData>;
    generateAsyncAndSend(res: Response, data: TParams[], options?: TOptions): Promise<void>;
}

export interface DataExportModuleOptions {
    pdf: ModulePDFOptions;
}
