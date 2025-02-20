import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(userData: any): Promise<User> {
    const exists = await this.findByEmail(userData.email);
    if (exists) throw new BadRequestException('El correo ya está registrado.');
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    return user;
  }

  async update(id: string, userData: any): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    return this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
  }

  async delete(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async seedUsers() {
    const users = [
      { fullName: 'Admin', email: 'admin@example.com', password: 'admin123' },
    ];
    for (const user of users) {
      const exists = await this.findByEmail(user.email);
      if (!exists) await this.create(user);
    }
  }
}
