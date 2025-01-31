import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async generateOtp(): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    var transport = nodemailer.createTransport({
      host: this.config.get('MAIL_TRAP_HOST'),
      port: this.config.get('MAIL_TRAP_PORT'),
      auth: {
        user: this.config.get('MAIL_TRAP_USER'),
        pass: this.config.get('MAIL_TRAP_PASS'),
      },
    });

    const mailOptions = {
      from: '"Your App Name" <no-reply@yourapp.com>',
      to: email,
      subject: 'Email Verification OTP',
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    };

    try {
      await transport.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.prisma.user.update({
      where: { email },
      data: {
        otp: null,
      },
    });
  }

  async sendTokenEmail(email: string, token: string): Promise<void> {
    var transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '77152036bc2e27',
        pass: 'e0ec8aa46ed0a7',
      },
    });

    const mailOptions = {
      from: '"Your App Name" <no-reply@yourapp.com>',
      to: email,
      subject: 'Email Verification Token',
      text: `Your Token is: ${token}`,
      html: `<p>Your Token is: <strong>${token}</strong></p>`,
    };

    console.log(mailOptions);
    try {
      await transport.sendMail(mailOptions);
      console.log('Email sent');
    } catch (error) {
      console.error('Error sending email: ', error);
    }

    console.log('doen');
  }

  async verifyToken(email: string, token: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.token !== token) {
      throw new BadRequestException('Invalid Token');
    }

    // Update user as verified and clear the token
    await this.prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        token: null,
      },
    });
  }
}
