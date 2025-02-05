import { Module } from '@nestjs/common';
import { JobManagementService } from './job-management.service';
import { JobManagementController } from './job-management.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.stratgy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [JwtModule.register({ privateKey: '' })],
  providers: [JobManagementService, JwtStrategy, ConfigService],
  controllers: [JobManagementController],
})
export class JobManagementModule {}
