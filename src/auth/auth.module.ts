import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { VerificationService } from './userVerification';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerExceptionFilter } from 'src/auth/filters/throttler-exception-filtter';

@Module({
  imports: [JwtModule.register({ privateKey: '' })],
  providers: [
    AuthService,
    VerificationService,
    {
      provide: APP_FILTER,
      useClass: ThrottlerExceptionFilter,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
