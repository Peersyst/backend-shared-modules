import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@peersyst/mailer-module';

@Injectable()
export class AppService {
  constructor(
    @Inject(MailerService) private readonly mailerService: MailerService,
  ) {}

  async sendTestEmail(): Promise<void> {
    await this.mailerService.sendMail({
      to: 'ggarcia@peersyst.com',
      subject: 'MailerModule testing',
      template: 'test',
      context: {
        data: 'successfully!',
      },
    });
  }
}
