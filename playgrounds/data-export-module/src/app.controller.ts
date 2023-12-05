import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('csv')
  async exportCSV(@Res() response): Promise<void> {
    return this.appService.exportCSV(response);
  }

  @Get('pdf')
  async exportPDF(@Res() response): Promise<void> {
    return this.appService.exportPDF(response);
  }
}
