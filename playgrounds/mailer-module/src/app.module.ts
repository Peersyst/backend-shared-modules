import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@peersyst/mailer-module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        () => ({
          mailer: {
            host: 'smtp.ethereal.email',
            username: 'brianne.kuphal@ethereal.email',
            password: 'HeNVEd4tYGz6XxMV4j',
            port: '587',
            subject: 'Playground test subject',
          },
        }),
      ],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('mailer.host'),
          port: config.get('mailer.port'),
          auth: {
            user: config.get('mailer.username'),
            pass: config.get('mailer.password'),
          },
        },
        defaults: {
          from: config.get('mailer.subject'),
        },
        template: {
          compiler: 'handlebars',
          templatePath: join(process.cwd(), './templates'),
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
