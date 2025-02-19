import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JobManagementModule } from './job-management/job-management.module';
import { JobApplicationsModule } from './job-applications/job-applications.module';
import { UserModule } from './user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // MulterModule.register({
    //   dest: './uploads',
    // }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 1,
      },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: '77152036bc2e27',
          pass: 'e0ec8aa46ed0a7',
        },
      },
    }),
    JobManagementModule,
    JobApplicationsModule,
    UserModule,
    CloudinaryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
