import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: any): Promise<User> {
    const exists = await this.findByEmail(userData.email);
    if (exists)
      throw new BadRequestException('The email is already registered.');
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

  private cleanId(id: string): string {
    return id.replace(/^id:/, '');
  }

  async findById(id: string): Promise<User> {
    const cleanId = this.cleanId(id);

    const user = await this.userModel.findById(cleanId).exec();
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async update(id: string, userData: any): Promise<User> {
    const cleanId = this.cleanId(id);
    const user = await this.findById(cleanId);
    if (!user) throw new NotFoundException('User not found.');

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    return this.userModel
      .findByIdAndUpdate(cleanId, userData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<User> {
    const cleanId = this.cleanId(id);
    console.log(cleanId);

    const user = await this.findById(cleanId);
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    return this.userModel.findByIdAndDelete(cleanId).exec();
  }
}
