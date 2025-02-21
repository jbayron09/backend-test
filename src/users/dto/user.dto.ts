import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Full name of the user' })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({
    example: 'Juan Pérez Updated',
    description: 'Updated full name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  fullName?: string;
}
