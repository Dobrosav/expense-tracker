import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseResponseDto } from './dto/expense-response.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto, @Req() req: any) {
    const userId = req.user.sub;
    const result = await this.expensesService.create(createExpenseDto, userId);
    return ExpenseResponseDto.fromEntity(result);
  }

  @Get()
  async findAllByUserId(@Req() req: any) {
    const userId = req.user.sub;
    const expenses = await this.expensesService.findAllByUserId(userId);
    return expenses.map(ExpenseResponseDto.fromEntity);
  }

  @Get(':id')
  async findOneByUserId(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    const expense = await this.expensesService.findOneByUserId(+id, userId);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return ExpenseResponseDto.fromEntity(expense);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.expensesService.update(+id, updateExpenseDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.expensesService.remove(+id, userId);
  }
}
