import { User } from '../entities/users.entity';

export class UserResponseDto {
  id: number;
  email: string;
  created_at: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.created_at = user.created_at;
    return dto;
  }
}
