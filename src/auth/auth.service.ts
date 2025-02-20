import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /** 🔐 Validar credenciales de usuario */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales incorrectas.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciales incorrectas.');

    return user;
  }

  /** 🔑 Iniciar sesión y devolver un token JWT */
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

  /** 🔄 Refrescar token (Opcional) */
  async refreshToken(user: any) {
    const payload = { email: user.email, sub: user._id };
    return { access_token: this.jwtService.sign(payload) };
  }

  /** 📩 Enviar correo de recuperación de contraseña */
  async sendPasswordResetEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    const resetToken = this.jwtService.sign({ email }, { expiresIn: '1h' });
    const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });

    await transporter.sendMail({
      from: '"Soporte Backend Test" <no-reply@example.com>',
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
    });

    return { message: 'Correo de recuperación enviado.' };
  }

  /** 🔄 Restablecer contraseña */
  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findByEmail(decoded.email);
      if (!user) throw new NotFoundException('Usuario no encontrado.');

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.usersService.update(user._id, { password: hashedPassword });

      return { message: 'Contraseña actualizada correctamente.' };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }
}
