import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, RefreshTokenDto } from "./dto/auth.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user and returns a JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    schema: { example: { access_token: 'token_here' } },
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Sends a password reset link to the email',
  })
  @ApiResponse({ status: 200, description: 'Reset email sent' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.sendPasswordResetEmail(body.email);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Resets the password using a token',
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Generates a new JWT token for the authenticated user',
  })
  @ApiResponse({ status: 200, description: 'New JWT token generated' })
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
