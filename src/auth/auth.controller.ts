import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ResendOtpDto, ResetPwDto, SigninDto } from './dto';
import { VerifyEmailDto, VerifyEmailOtpDTo } from './dto/verify.dto';
import { Throttle } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from './filters/throttler-exception-filtter';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() authDto: AuthDto) {
    return this.authService.signup(authDto);
  }

  @Post('signin')
  signin(@Body() authDto: SigninDto) {
    return this.authService.signin(authDto);
  }

  @Post('verify-email')
  verifyEmail(@Body() verifyDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyDto);
  }

  @Post('reset-ps')
  resetPassword(@Body() resetDto: ResetPwDto) {
    return this.authService.resetPassword(resetDto);
  }

  @Post('reset-ps-otp')
  resetPasswordOtp(@Body() resetDto: VerifyEmailOtpDTo) {
    return this.authService.resetPasswordOtp(resetDto);
  }

  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @UseFilters(ThrottlerExceptionFilter)
  @Post('resend-otp')
  ResendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto);
  }
}
