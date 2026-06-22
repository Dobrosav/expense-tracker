import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';
import { Expense } from '../entities/expense.entity';

export class CreateExpenseDto {
  @IsNumber()
  @IsPositive({ message: 'Amount must be greater than 0' })
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString(
    {},
    { message: 'Date must be in valid format (e.g. 2026-06-22).' },
  )
  date: string;

  @IsInt({ message: 'Category ID must be an integer.' })
  @IsNotEmpty()
  categoryId: number;

  static fromEntity(entity: Expense): CreateExpenseDto {
    const dto = new CreateExpenseDto();
    dto.amount = entity.amount;
    dto.date = entity.date;
    dto.categoryId = entity.category.id;
    return dto;
  }
}
