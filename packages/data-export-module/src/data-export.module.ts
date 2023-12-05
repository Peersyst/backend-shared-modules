import { DynamicModule, Module, Provider } from "@nestjs/common";
import { CSVService } from "./modules/csv/csv.service";
import { PDFService } from "./modules/pdf/pdf.service";
import { DataExportModuleOptions } from "./types";
import { DATA_EXPORT_PDF_OPTIONS } from "./constants";

@Module({})
export class DataExportModule {
    private static createOptionsProviders(options: DataExportModuleOptions): Provider[] {
        const { pdf } = options;
        const providers: Provider[] = [];

        if (options.pdf) {
            providers.push({
                provide: DATA_EXPORT_PDF_OPTIONS,
                useValue: pdf,
            });
        }

        return providers;
    }

    static forRoot(options: DataExportModuleOptions): DynamicModule {
        const providers = this.createOptionsProviders(options);
        const dataExportServices = [CSVService, PDFService];

        return {
            module: DataExportModule,
            global: true,
            exports: dataExportServices,
            providers: [...providers, ...dataExportServices],
        };
    }
}
