import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import VerificationTokenPayload from './interfaces/verificationTokenPayload.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly userService: UsersService,
  ) {}

  sendVerificationLink(email: string) {
    console.log('🚀 ~ ~ email:', email);

    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: `${process.env.JWT_VERIFICATION_TOKEN_SECRET}`,
      expiresIn: `${process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME}`,
    });
    const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;
    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }

  async resendConfirmationLink(id: number) {
    const user = await this.userService.findOne(id);
    if (user.verified) {
      throw new BadRequestException('Email already confirm');
    }
    await this.sendVerificationLink(user.email);
  }

  async confirmEmail(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (user.verified) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.userService.markEmailAsConfirmed(user.id);
  }
  async decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: `${process.env.JWT_VERIFICATION_TOKEN_SECRET}`,
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (e) {
      if (e?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
  async sendLinkResetPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new BadRequestException('User does not exist');
    const payload = { email };
    const resetPassToken = this.jwtService.sign(payload, {
      secret: `${process.env.JWT_RESET_PASSWORD_TOKEN_SECRET}`,
      expiresIn: `${process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRATION_TIME}`,
    });
    const url = `${process.env.EMAIL_RESET_PASS_URL}?token=${resetPassToken}`;
    const text = `Click here to change password: ${url}`;
    return await this.emailService.sendMail({
      to: email,
      subject: 'Email reset password',
      text,
    });
  }
}
