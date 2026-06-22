import { IsString, IsNotEmpty } from 'class-validator';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  static fromEntity(category: Category): CreateCategoryDto {
    const dto = new CreateCategoryDto();
    dto.name = category.name;
    return dto;
  }
}
