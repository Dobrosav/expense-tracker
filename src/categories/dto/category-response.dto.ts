import { Category } from '../entities/category.entity';

export class CategoryResponseDto {
  id: number;
  name: string;

  static fromEntity(category: Category): CategoryResponseDto {
    const dto = new CategoryResponseDto();
    dto.id = category.id;
    dto.name = category.name;
    return dto;
  }
}
