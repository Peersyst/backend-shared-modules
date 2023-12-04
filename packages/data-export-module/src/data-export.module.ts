import { Module } from "@nestjs/common";
import { CSVService } from "./modules/csv/csv.service";
import { PDFService } from "./modules/pdf/pdf.service";

@Module({
    providers: [CSVService, PDFService],
    exports: [CSVService, PDFService],
})
export class DataExportModule {}
