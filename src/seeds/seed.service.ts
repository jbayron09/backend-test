import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { usersSeedData } from './data.seed';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(private usersService: UsersService) {}

  async runSeeds() {
    console.log('Running database seeds...');
    for (const user of usersSeedData) {
      const exists = await this.usersService.findByEmail(user.email);
      if (!exists) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await this.usersService.create({
          ...user,
          password: hashedPassword,
        });
        console.log(`Created user: ${user.email}`);
      } else {
        console.log(`ser already exists: ${user.email}`);
      }
    }
    console.log('Database seeding completed.');
  }
}
