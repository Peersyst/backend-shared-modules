import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataExportModule } from '@peersyst/data-export-module';
import { join } from 'path';

@Module({
  imports: [
    DataExportModule.forRoot({
      pdf: {
        templateDir: join(process.cwd(), 'templates'),
        exportDir: join(process.cwd(), 'files'),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
