import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async createUser(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Registering user: ${body.email}`);
    const user = await this.usersService.create(body.email, body.password);
    return UserResponseDto.fromEntity(user);
  }

  @Get(':email')
  async findByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    this.logger.log(`Finding user: ${email}`);

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserResponseDto.fromEntity(user);
  }

  @UseGuards(AuthGuard)
  @Get('me/profile')
  async getMyProfile(@Req() req: any): Promise<UserResponseDto> {
    this.logger.log(`Finding user: ${req.user.sub}`);
    const user = await this.usersService.findById(req.user.sub);

    if (!user) {
      this.logger.warn(`User not found: ${req.user.sub}`);
      throw new NotFoundException('User not found');
    }

    this.logger.log(`User found: ${user.email}`);
    return UserResponseDto.fromEntity(user);
  }
}
