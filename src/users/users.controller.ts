import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('AllUsers')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all registered users',
  })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('UserDetails/:id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns details of a user by their ID',
  })
  @ApiResponse({ status: 200, description: 'User details', type: User })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post('createUser')
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Registers a new user in the system',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiBody({ type: CreateUserDto })
  create(@Body() userData: any) {
    return this.usersService.create(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateUser/:id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Updates the information of an existing user',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() userData: any) {
    return this.usersService.update(id, userData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteUser/:id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Deletes a user by their ID',
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
