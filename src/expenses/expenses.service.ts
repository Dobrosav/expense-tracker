import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: number) {
    this.logger.log(`Creating expense for user ${userId}`);
    const expense = this.expenseRepository.create({
      amount: createExpenseDto.amount,
      date: createExpenseDto.date,
      user: { id: userId },
      category: { id: createExpenseDto.categoryId },
    });
    return await this.expenseRepository.save(expense);
  }

  async findAllByUserId(userId: number) {
    this.logger.log(`Fetching all expenses for user ${userId}`);
    return this.expenseRepository.find({
      where: { user: { id: userId } },
      relations: { category: true },
    });
  }

  async findOneByUserId(id: number, userId: number) {
    this.logger.log(`Fetching expense ${id} for user ${userId}`);
    return this.expenseRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { category: true },
    });
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto, userId: number) {
    this.logger.log(`Updating expense ${id} for user ${userId}`);
    const expense = await this.findOneByUserId(id, userId);
    if (!expense) {
      this.logger.warn(`Expense ${id} not found for user ${userId}`);
      throw new NotFoundException('Expense not found');
    }
    if (updateExpenseDto.amount !== undefined) {
      expense.amount = updateExpenseDto.amount;
    }
    if (updateExpenseDto.date !== undefined) {
      expense.date = updateExpenseDto.date;
    }
    if (updateExpenseDto.categoryId !== undefined) {
      expense.category = { id: updateExpenseDto.categoryId } as any;
    }
    if (updateExpenseDto.description !== undefined) {
      expense.description = updateExpenseDto.description;
    }
    return await this.expenseRepository.save(expense);
  }

  async remove(id: number, userId: number) {
    this.logger.log(`Removing expense ${id} for user ${userId}`);
    const expense = await this.findOneByUserId(id, userId);
    if (!expense) {
      this.logger.warn('expense not found for user' + userId);
      throw new NotFoundException('Expense not found');
    }
    this.logger.log('Deleting expense with id' + id);
    return await this.expenseRepository.delete(id);
  }
}
