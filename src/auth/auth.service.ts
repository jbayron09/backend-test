import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { User } from '../users/schemas/user.schema';
import { RefreshTokenDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private resend: Resend;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Incorrect credentials.');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Incorrect credentials.');

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { email: user.email, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { userId, email } = refreshTokenDto;

    if (!userId || !email) {
      throw new UnauthorizedException('Invalid user data.');
    }

    const payload = { email, sub: userId };
    return { access_token: this.jwtService.sign(payload) };
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found.');
    console.log(email);
    const resetToken = this.jwtService.sign(
      { email },
      { expiresIn: process.env.JWT_EXPIRATION },
    );

    try {
      const response = await this.resend.emails.send({
        from: `Acme <${this.configService.get('EMAIL_FROM')}>`,
        to: [email],
        subject: 'Password Reset Request',
        html: `
          <p>Hello,</p>
          <p>Your password reset token is:</p>
          <p><strong>${resetToken}</strong></p>
          <p>Use this token in the API to reset your password.</p>
          <p>If you did not request this, please ignore this email.</p>
        `,
      });

      if (response.error) {
        return {
          message: 'Failed to send password reset email.',
          error: response.error.message,
        };
      }

      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('Exception in sendPasswordResetEmail:', error);
      if (error.response) {
        return {
          message: 'Failed to send password reset email.',
          error: error.message.data.message,
        };
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while sending the email.',
      );
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findByEmail(decoded.email);

      if (!user) throw new NotFoundException('User not found.');

      await this.usersService.update(String(user._id), {
        password: newPassword,
      });

      return { message: 'Password updated successfully.' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
