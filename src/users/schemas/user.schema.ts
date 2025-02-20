import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class User extends Document {
  @ApiProperty({ example: 'Juan Pérez', description: 'Full name of the user' })
  @Prop({ required: true })
  fullName: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Email of the user',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (hashed)',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    example: '2025-02-20T12:00:00.000Z',
    description: 'Date of creation',
  })
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
