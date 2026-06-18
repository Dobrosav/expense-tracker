import { Controller, Post, Get, Body, Param , NotFoundException, UseGuards, Req} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async createUser(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    console.log('Registrujem korisnika:', body.email); 
    const user = await this.usersService.create(body.email, body.password);
    return UserResponseDto.fromEntity(user);
  }

  @Get(':email')
  async findByEmail(@Param('email') email: string) : Promise<UserResponseDto>{
    console.log('Tražim email:', email); 

  const user = await this.usersService.findByEmail(email);

  if (!user) {
    throw new NotFoundException("User not found");
  }
  return UserResponseDto.fromEntity(user);
  }
  
  @UseGuards(AuthGuard)
  @Get("me/profile")
  async getMyProfile(@Req() req: any): Promise<UserResponseDto> {
    const user = await this.usersService.findById(req.user.sub);
    
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return UserResponseDto.fromEntity(user);
  }

}