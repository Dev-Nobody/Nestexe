import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, ResendOtpDto, SigninDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { VerificationService } from './userVerification';
import { VerifyEmailDto, VerifyEmailOtpDTo } from './dto/verify.dto';
import { ResetPwDto } from './dto/resetpw.dto';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private userVerify: VerificationService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async signup(authDto: AuthDto) {
    try {
      const otp = await this.userVerify.generateOtp();
      if (
        !authDto.confirmPassword ||
        authDto.password !== authDto.confirmPassword
      ) {
        throw new ForbiddenException("Password Doesn't Match");
      }
      const hash = await argon.hash(authDto.password);

      const user = await this.prismaService.user.create({
        data: {
          email: authDto.email,
          hash,
          isVerified: false,
          role: authDto.role,
          username: authDto.username,
          phoneNumber: authDto.phoneNumber,
        },
      });
      const tokenData = this.signToken(user.id, user.email, user.role);
      const token = (await tokenData).access_token;
      await this.prismaService.user.update({
        where: { id: user.id },
        data: { token, otp },
      });

      await this.userVerify.sendOtpEmail(user.email, otp);

      return {
        message: 'User registered successfully. Please verify your email.',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken ');
        }
      }
      throw error;
    }
  }

  async signin(authDto: SigninDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: authDto.email },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const passMatch = await argon.verify(user.hash, authDto.password);

    if (!passMatch) throw new ForbiddenException('Credentials incorrect');

    // if (!user.isVerified) throw new ForbiddenException('Not Verified');

    return this.signToken(user.id, user.email, user.role);
  }

  async verifyEmail(dto: VerifyEmailDto) {
    await this.userVerify.verifyOtpReg(dto.email, dto.otp);
    return { message: 'Email verified successfully.' };
  }

  async resetPasswordOtp(dto: VerifyEmailOtpDTo) {
    await this.userVerify.verifyOtp(dto.email, dto.otp);

    const hash = await argon.hash(dto.newPass);

    const user = await this.prismaService.user.update({
      where: { email: dto.email },
      data: {
        hash,
      },
    });
    return { message: 'Password Reset successfully.' };
  }

  async resetPassword(dto: ResetPwDto) {
    const otp = await this.userVerify.generateOtp();

    const user = await this.prismaService.user.update({
      where: { email: dto.email },
      data: {
        otp: otp,
      },
    });

    if (!user) throw new ForbiddenException("USer Doesn't exist");

    await this.userVerify.sendOtpEmail(dto.email, otp);

    return { message: 'Check Your Email For OTP.' };
  }

  async resendOtp(dto: ResetPwDto) {
    try {
      const otp = await this.userVerify.generateOtp();
      const user = await this.prismaService.user.update({
        where: { email: dto.email },
        data: { otp },
      });
      if (!user) throw new ForbiddenException('User Doesnt Exist ');
      await this.userVerify.sendOtpEmail(dto.email, otp);
      return 'Otp Has Been Resent , Check Your Email';
    } catch (error) {
      return { error };
    }
  }

  async resendToken(dto: ResendOtpDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) throw new ForbiddenException('User does not exist');
      if (user.isVerified)
        throw new ForbiddenException('User already verified');

      const tokenData = this.signToken(user.id, user.email, user.role);
      const token = (await tokenData).access_token;

      await this.prismaService.user.update({
        where: { id: user.id },
        data: { token },
      });

      await this.userVerify.sendTokenEmail(user.email, token);

      return {
        message: 'Verification token has been resent. Check your email.',
      };
    } catch (error) {
      throw new BadGatewayException('Error resending token');
    }
  }

  //Function For Creating Token
  async signToken(
    userId: number,
    email: string,
    role: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      id: userId,
      email,
      role,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
