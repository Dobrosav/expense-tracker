import { Controller, Post, Get, Body, Param , NotFoundException} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

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
    throw new NotFoundException(`Korisnik sa email-om '${email}' nije pronađen.`);
  }
  return UserResponseDto.fromEntity(user);
  }
}