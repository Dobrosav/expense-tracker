import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { NotFoundException } from '@nestjs/common';

describe('ExpensesService', () => {
  let service: ExpensesService;

  const mockExpenseRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expense),
          useValue: mockExpenseRepository,
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save an expense', async () => {
      const createDto = { amount: 100, date: '2026-06-22', categoryId: 2 };
      const userId = 1;
      const createdExpense = {
        id: 1,
        ...createDto,
        user: { id: userId },
        category: { id: 2 },
      };

      mockExpenseRepository.create.mockReturnValue(createdExpense);
      mockExpenseRepository.save.mockResolvedValue(createdExpense);

      const result = await service.create(createDto, userId);

      expect(mockExpenseRepository.create).toHaveBeenCalledWith({
        amount: createDto.amount,
        date: createDto.date,
        user: { id: userId },
        category: { id: createDto.categoryId },
      });
      expect(mockExpenseRepository.save).toHaveBeenCalledWith(createdExpense);
      expect(result).toEqual(createdExpense);
    });
  });

  describe('findAllByUserId', () => {
    it('should return all expenses for a user', async () => {
      const expenses = [{ id: 1, amount: 100 }];
      mockExpenseRepository.find.mockResolvedValue(expenses);

      const result = await service.findAllByUserId(1);

      expect(mockExpenseRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: { category: true },
      });
      expect(result).toEqual(expenses);
    });
  });

  describe('findOneByUserId', () => {
    it('should return an expense', async () => {
      const expense = { id: 1, amount: 100 };
      mockExpenseRepository.findOne.mockResolvedValue(expense);

      const result = await service.findOneByUserId(1, 1);

      expect(mockExpenseRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, user: { id: 1 } },
        relations: { category: true },
      });
      expect(result).toEqual(expense);
    });
  });

  describe('update', () => {
    it('should update and return an expense', async () => {
      const expense = {
        id: 1,
        amount: 100,
        date: '2026-06-22',
        category: { id: 1 },
      };
      const updateDto = { amount: 200, categoryId: 3 };

      mockExpenseRepository.findOne.mockResolvedValue(expense);
      mockExpenseRepository.save.mockResolvedValue({
        ...expense,
        amount: 200,
        category: { id: 3 },
      });

      const result = await service.update(1, updateDto, 1);

      expect(mockExpenseRepository.save).toHaveBeenCalledWith({
        id: 1,
        amount: 200,
        date: '2026-06-22',
        category: { id: 3 },
      });
      expect(result.amount).toBe(200);
    });

    it('should throw NotFoundException if expense is not found', async () => {
      mockExpenseRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, {}, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an expense', async () => {
      const expense = { id: 1, amount: 100 };
      mockExpenseRepository.findOne.mockResolvedValue(expense);
      mockExpenseRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1, 1);

      expect(mockExpenseRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if expense to delete is not found', async () => {
      mockExpenseRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
