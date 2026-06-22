import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { ExpenseResponseDto } from './dto/expense-response.dto';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let service: ExpensesService;

  const mockExpensesService = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
    findOneByUserId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequest = {
    user: { sub: 1 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: mockExpensesService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ExpensesController>(ExpensesController);
    service = module.get<ExpensesService>(ExpensesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an expense and return response dto', async () => {
      const createDto: CreateExpenseDto = {
        amount: 100,
        date: '2026-06-22',
        categoryId: 2,
      };
      const createdExpense = {
        id: 1,
        amount: 100,
        date: '2026-06-22',
        category: { id: 2 },
      } as Expense;

      mockExpensesService.create.mockResolvedValue(createdExpense);

      const result = await controller.create(createDto, mockRequest);

      expect(service.create).toHaveBeenCalledWith(createDto, 1);
      expect(result).toBeInstanceOf(ExpenseResponseDto);
      expect(result.amount).toBe(100);
      expect(result.categoryId).toBe(2);
    });
  });

  describe('findAllByUserId', () => {
    it('should return array of response dtos', async () => {
      const expenses = [{ id: 1, amount: 100, category: { id: 2 } } as Expense];
      mockExpensesService.findAllByUserId.mockResolvedValue(expenses);

      const result = await controller.findAllByUserId(mockRequest);

      expect(service.findAllByUserId).toHaveBeenCalledWith(1);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(ExpenseResponseDto);
      expect(result[0].id).toBe(1);
    });
  });

  describe('findOneByUserId', () => {
    it('should return a single response dto', async () => {
      const expense = { id: 1, amount: 100, category: { id: 2 } } as Expense;
      mockExpensesService.findOneByUserId.mockResolvedValue(expense);

      const result = await controller.findOneByUserId('1', mockRequest);

      expect(service.findOneByUserId).toHaveBeenCalledWith(1, 1);
      expect(result).toBeInstanceOf(ExpenseResponseDto);
      expect(result.id).toBe(1);
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      const updateDto: UpdateExpenseDto = { amount: 200 };
      const updatedExpense = { id: 1, amount: 200 } as Expense;

      mockExpensesService.update.mockResolvedValue(updatedExpense);

      const result = await controller.update('1', updateDto, mockRequest);

      expect(service.update).toHaveBeenCalledWith(1, updateDto, 1);
      expect(result).toEqual(updatedExpense);
    });
  });

  describe('remove', () => {
    it('should remove an expense', async () => {
      mockExpensesService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove('1', mockRequest);

      expect(service.remove).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
