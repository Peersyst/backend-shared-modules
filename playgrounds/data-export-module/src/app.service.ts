import { Inject, Injectable } from '@nestjs/common';
import { CSVService, PDFService } from '@peersyst/data-export-module';
import { Response } from 'express';

export interface AppData {
  data: any;
}

@Injectable()
export class AppService {
  constructor(
    @Inject(PDFService<AppData>)
    private readonly pdfService: PDFService<AppData>,
    @Inject(CSVService<AppData>)
    private readonly csvService: CSVService<AppData>,
  ) {}

  async exportPDF(res: Response): Promise<void> {
    return await this.pdfService.generateAsyncAndSend(
      res,
      { data: 'data' },
      { fileName: 'data-test', templateName: 'test' },
    );
  }

  async exportCSV(res: Response): Promise<void> {
    return this.csvService.generateAndSend(res, [{ data: 'test' }], {
      fileName: 'test',
    });
  }
}
