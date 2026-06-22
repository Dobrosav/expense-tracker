import { Expense } from '../entities/expense.entity';

export class ExpenseResponseDto {
  id: number;
  amount: number;
  date: string;
  description: string;
  categoryId: number;

  static fromEntity(expense: Expense): ExpenseResponseDto {
    const dto = new ExpenseResponseDto();
    dto.id = expense.id;
    dto.amount = expense.amount;
    dto.date = expense.date;
    dto.description = expense.description;
    dto.categoryId = expense.category?.id || 0;
    return dto;
  }
}
