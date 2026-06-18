import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService, 
        private userService: UsersService
    ) { }

    async login(email:string, password:string): Promise<{ access_token: string } >{
        const user = await this.userService.findByEmail(email);
        if(!user){
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
       
        if(!isMatch){
            throw new UnauthorizedException('Invalid credentials');
        }
       
        const payload = { sub: user.id, email: user.email };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
